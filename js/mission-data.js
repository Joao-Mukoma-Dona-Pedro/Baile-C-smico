(function () {
    const CONFIDENTIAL_CODES = {
        1: "RA 13h DEC -49°",
        2: "RA 18h DEC +38°",
        3: "RA 05h DEC -05°",
        4: "RA 17h DEC -23°"
    };

    const AGENT_GROUPS = {
        1: [
            "Virgília",
            "Belmira",
            "Nair",
            "Emília",
            "Ozzy Osbourne",
            "Rauha",
            "Domingos",
            "Nazaré Hafeni",
            "Reinaldo Vaz",
            "Gilberto Tuahafeni",
            "Ariel Hidínua",
            "Balduíno Victor",
            "Esleidy",
            "Lwena",
            "Felisberta",
            "Evalinda",
            "Edvirgem",
            "Relícia",
            "Edvânia",
            "Édson Figueira"
        ],
        2: [
            "Gilson",
            "Maurício",
            "Obama",
            "Dioclésia",
            "Mariene",
            "Tóldia",
            "Celciosa",
            "Arilton",
            "Valndresa",
            "Jota Zua"
        ],
        3: [
            "Leogiany",
            "Júlia",
            "Miriam",
            "Félix",
            "Célcia",
            "Florinda Ngufwenya",
            "Ana Figueira"
        ],
        4: [
            "Amilton",
            "Anderson",
            "Délvio",
            "Fernando",
            "Hermenegildo",
            "Sócrates",
            "Janilson",
            "João",
            "Lemuel",
            "Ndinoite"
        ]
    };

    const GUESTS = Object.entries(AGENT_GROUPS).flatMap(([codigo, nomes]) =>
        nomes.map((nome) => ({
            nome,
            codigo: Number(codigo),
            aliases: [firstName(nome)]
        }))
    );

    const MESSAGE_TEMPLATES = [
        ({ primeiroNome }) => [
            `Agente ${primeiroNome},`,
            "",
            "Foste seleccionado para uma operação cósmica confidencial.",
            "",
            "A assinatura secreta da tua missão foi desbloqueada.",
            "",
            "Prepara-te para o embarque."
        ],
        ({ primeiroNome }) => [
            `Agente ${primeiroNome},`,
            "",
            "O universo convocou-te através de um canal reservado.",
            "",
            "A tua identidade orbital foi validada em silêncio.",
            "",
            "Atravessa o portal quando a noite acender."
        ],
        ({ primeiroNome }) => [
            `Agente ${primeiroNome},`,
            "",
            "A estação orbital confirmou o teu sinal.",
            "",
            "Um código reservado foi integrado no convite.",
            "",
            "Mantém a frequência. A missão aproxima-se."
        ],
        ({ primeiroNome }) => [
            `Agente ${primeiroNome},`,
            "",
            "Uma frequência rara atravessou o cosmos e encontrou o teu nome.",
            "",
            "A autorização foi selada no campo escuro do convite.",
            "",
            "Chega como quem conhece o segredo das estrelas."
        ]
    ];

    function normalize(value) {
        return (value || "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9 ]+/g, "");
    }

    function firstName(value) {
        return (value || "Convidado").trim().split(/\s+/)[0] || "Convidado";
    }

    function normalizedFirstName(value) {
        return normalize(firstName(value));
    }

    function levenshteinDistance(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;

        const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
        const current = Array(b.length + 1).fill(0);

        for (let i = 1; i <= a.length; i += 1) {
            current[0] = i;
            for (let j = 1; j <= b.length; j += 1) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                current[j] = Math.min(
                    current[j - 1] + 1,
                    previous[j] + 1,
                    previous[j - 1] + cost
                );
            }
            previous.splice(0, previous.length, ...current);
        }

        return previous[b.length];
    }

    function allowsSmallVariation(queryFirst, guestFirst) {
        const shortest = Math.min(queryFirst.length, guestFirst.length);
        if (shortest < 4) return false;
        const maxDistance = shortest >= 7 ? 2 : 1;
        return levenshteinDistance(queryFirst, guestFirst) <= maxDistance;
    }

    function firstNamesMatch(queryFirst, guestFirst) {
        if (!queryFirst || !guestFirst) return false;
        if (queryFirst === guestFirst) return true;
        if (queryFirst.length >= 3 && guestFirst.startsWith(queryFirst)) return true;
        if (guestFirst.length >= 3 && queryFirst.startsWith(guestFirst)) return true;
        return allowsSmallVariation(queryFirst, guestFirst);
    }

    function guestSearchText(guest) {
        return [guest.nome, ...(guest.aliases || [])].map(normalize).filter(Boolean);
    }

    function matchScore(query, guest) {
        const cleanQuery = normalize(query);
        if (!cleanQuery) return null;

        const queryTokens = cleanQuery.split(" ").filter(Boolean);
        const queryFirst = queryTokens[0] || "";
        const guestFirst = normalizedFirstName(guest.nome);

        if (queryFirst && guestFirst) {
            if (queryFirst === guestFirst) return 10;
            if (queryFirst.length >= 3 && guestFirst.startsWith(queryFirst)) {
                return 100 + (guestFirst.length - queryFirst.length);
            }
            if (guestFirst.length >= 3 && queryFirst.startsWith(guestFirst)) {
                return 200 + (queryFirst.length - guestFirst.length);
            }
        }

        let bestScore = null;
        guestSearchText(guest).forEach((candidate) => {
            const candidateTokens = candidate.split(" ").filter(Boolean);
            let score = null;
            if (candidate === cleanQuery) score = 0;
            else if (candidate.startsWith(`${cleanQuery} `)) score = 300 + (candidate.length - cleanQuery.length);
            else if (cleanQuery.startsWith(`${candidate} `)) score = 400 + (cleanQuery.length - candidate.length);
            else if (queryTokens.every((token) => candidateTokens.includes(token))) score = 500;

            if (score !== null && (bestScore === null || score < bestScore)) bestScore = score;
        });

        if (bestScore !== null) return bestScore;

        if (queryFirst && guestFirst && allowsSmallVariation(queryFirst, guestFirst)) {
            return 800 + levenshteinDistance(queryFirst, guestFirst);
        }

        return null;
    }

    function matchesGuest(query, guest) {
        return matchScore(query, guest) !== null;
    }

    function resolveGuest(name) {
        const match = GUESTS
            .map((guest, index) => ({ guest, index, score: matchScore(name, guest) }))
            .filter((item) => item.score !== null)
            .sort((a, b) => a.score - b.score || a.index - b.index)[0];
        if (!match) return null;

        const guest = match.guest;
        const codeIndex = Number(guest.codigo);
        const codigoConfidencial = CONFIDENTIAL_CODES[codeIndex] || "";

        return {
            nome: guest.nome,
            primeiroNome: firstName(guest.nome),
            codigo: codeIndex,
            codigoConfidencial,
            aliases: guest.aliases || []
        };
    }

    function messageIndex(name, agent) {
        const seed = `${normalize(name)}-${agent}`;
        let hash = 0;
        for (let index = 0; index < seed.length; index += 1) {
            hash = (hash + seed.charCodeAt(index) * (index + 1)) % MESSAGE_TEMPLATES.length;
        }
        return hash;
    }

    function missionMessage(name, mission) {
        if (!mission) {
            return [
                `Agente ${firstName(name)},`,
                "",
                "O teu sinal foi recebido pela central.",
                "",
                "A assinatura confidencial ainda aguarda validação."
            ].join("\n");
        }

        const payload = {
            primeiroNome: mission.primeiroNome || firstName(name || mission.nome)
        };

        return MESSAGE_TEMPLATES[messageIndex(name || mission.nome, mission.codigo)](payload).join("\n");
    }

    window.BaileCosmicoMission = {
        confidentialCodes: CONFIDENTIAL_CODES,
        agentGroups: AGENT_GROUPS,
        guests: GUESTS,
        normalize,
        resolveGuest,
        missionMessage
    };
})();
