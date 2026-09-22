import { TeamMember } from '../types';

export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export const siteContent = {
  nav: {
    items: [
      { id: 'origem', label: 'Origem' },
      { id: 'dora', label: 'Projeto Dora' },
      { id: 'brasa', label: 'A BRASA' },
      { id: 'equipe', label: 'Equipe' },
    ] as NavItem[],
  },

  hero: {
    headline: {
      line1: 'Construindo o mundo da ',
      line2: 'robótica aérea brasileira',
      line3: 'com excelência e confiança',
    },
    scrollCueAriaLabel: 'Avançar para história de origem',
  },

  origin: {
    label: 'Origem',
    title: 'Três estudantes e a paixão pela robótica aérea.',
    body: 'Em um grupo de extensão de robótica aérea, eles se conheceram e descobriram uma paixão em comum pela área. Entre projetos, competições nacionais e internacionais, experiências trabalhando no setor e muitas horas construindo juntos, perceberam que queriam dedicar suas carreiras à engenharia. Mas os inquietava a distância entre a engenharia desenvolvida na universidade e as oportunidades para exercê-la fora dela.',
    imageAlt: 'Vista aérea de um telhado, fotografado por um drone drone, com sua dock no centro da imagem. À esquerda da dock está o fundador Felipe Beserra; acima, o fundador Ricardo; e à direita, mais abaixo, o fundador Vinicius. Os três estão voltados para cima e olham diretamente para o drone que registra a cena.',
  },

  brasa: {
    label: 'A BRASA',
    titleLine1: 'Esta é a BRASA Robótica aérea, ',
    titleHighlight: 'pensada para o Brasil.',
    bodyCol1: 'A BRASA nasce de estudantes da USP que decidiram transformar conhecimento técnico em tecnologia de ponta, valorizando quem se forma aqui e devolvendo ao país em oportunidades e desenvolvimento regional.',
    bodyCol2: 'Existimos para conectar pessoas: quem constrói, quem usa e quem é impactado pela robótica aérea, criando um espaço onde talento nacional encontra oportunidades.',
    bodyCol3: 'Atuamos com responsabilidade técnica e compromisso com resultado, sempre com foco em eficiência, impacto positivo e segurança, para quem utiliza e para quem é impactado pela nossa tecnologia.',
  },

  dora: {
    label: 'Projeto Dora',
    introText: 'O Projeto Dora foi o primeiro passo para virar o jogo.',
    titleLine1: 'Tecnologia que ',
    titleHighlight: 'Protege Vidas',
    subtitle: 'Sistema Inteligente de Monitoramento Aéreo para Segurança Pública e Proteção da Mulher',
    bodyCol1: 'O Brasil Precisa de Respostas mais rápidas. Todos os dias: Mulheres vivem situações de violência e vulnerabilidade, emergências demoram para receber suporte, municípios sofrem com falta de monitoramento inteligente. Quando uma mulher pede ajuda, ela não pode esperar, Dora responde em segundos.',
    bodyCol2: 'Quando uma mulher pede ajuda, ela não pode esperar. Dora responde em segundos.',
    insights: [
      {
        title: 'Importância',
        body: 'Em situações de violência e vulnerabilidade, a distância entre o pedido de ajuda e a chegada de suporte pode ser decisiva. O Projeto Dora parte dessa urgência: usar mobilidade aérea para levar presença e visibilidade à ocorrência com mais agilidade.',
      },
      {
        title: 'De que maneira',
        body: 'Uma mulher em situação de risco pega o celular e pressiona um único botão. Em segundos o drone decola, a central inicia o acompanhamento ao vivo, a equipe em terra é acionada e toda a entrega é monitorada em tempo real. As imagens auxiliam como suporte operacional e evidência, no qual o objetivo não é apenas reagir, mas inibir a violência para que não aconteça.',
      },
      {
        title: 'Execução',
        body: 'O Dora combina drones e monitoramento para alcançar a área de uma ocorrência, transmitir imagens em tempo real e ampliar a visão de quem coordena a resposta. A tecnologia funciona como apoio operacional à segurança, não como substituição dos serviços de emergência.',
      },
    ],
    partnership: 'O Projeto Dora é uma parceria BRASA e Oxigenius.',
    locations: {
      title: 'Cobertura',
      items: [
        {
          name: 'USP Campus Butantã',
          status: 'Em breve',
          hidden: true,
        },
      ],
    },
  },

  team: {
    label: 'Equipe',
    foundersLabel: 'Fundadores',
    founders: [
      {
        id: 'pedro',
        name: 'Felipe Beserra',
        role: 'Tecnologia',
        isFounder: true,
        imageUrl: '/media/team/team-beserra.jpeg',
      },
      {
        id: 'ricardo',
        name: 'Ricardo Vasconcelos',
        role: 'Operações',
        isFounder: true,
        imageUrl: '/media/team/team-ricardo.jpg',
      },
      {
        id: 'vinicius',
        name: 'Vinicius Gomes',
        role: 'Administrativo',
        isFounder: true,
        imageUrl: '/media/team/team-vinicius.jpg',
      },
    ] as TeamMember[],
  },

  footer: {
    navHeader: 'NAVEGAÇÃO',
    socialHeader: 'REDES SOCIAIS',
    socialLinks: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/company/brasadrones' },
      { label: 'Instagram', url: 'https://instagram.com/brasadrones' },
    ] as SocialLink[],
    copyright: `BRASA ROBÓTICA AÉREA ${new Date().getFullYear()}`,
  },
} as const;
