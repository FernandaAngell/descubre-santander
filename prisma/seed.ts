import { PrismaClient, AccommodationType, IdealFor, Difficulty, Status, Role } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed...")

  // MUNICIPIOS
  const bucaramanga = await prisma.municipality.upsert({
    where: { slug: "bucaramanga" },
    update: {},
    create: {
      name: "Bucaramanga",
      slug: "bucaramanga",
      description: "Capital del departamento de Santander, conocida como la Ciudad Bonita por sus parques y clima agradable.",
      altitude: 959,
      weather: "Cálido, 24°C promedio",
      population: 600000,
      latitude: 7.1193,
      longitude: -73.1227,
    },
  })

  const floridablanca = await prisma.municipality.upsert({
    where: { slug: "floridablanca" },
    update: {},
    create: {
      name: "Floridablanca",
      slug: "floridablanca",
      description: "Municipio del área metropolitana de Bucaramanga, famoso por su naturaleza y glampings.",
      altitude: 925,
      weather: "Templado, 22°C promedio",
      population: 270000,
      latitude: 7.0639,
      longitude: -73.0877,
    },
  })

  const giron = await prisma.municipality.upsert({
    where: { slug: "giron" },
    update: {},
    create: {
      name: "Girón",
      slug: "giron",
      description: "Pueblo colonial patrimonio histórico de Colombia, con arquitectura republicana y el río de Oro.",
      altitude: 780,
      weather: "Cálido, 28°C promedio",
      population: 180000,
      latitude: 7.0731,
      longitude: -73.1678,
    },
  })

  const barichara = await prisma.municipality.upsert({
    where: { slug: "barichara" },
    update: {},
    create: {
      name: "Barichara",
      slug: "barichara",
      description: "Considerado el pueblo más bonito de Colombia. Calles empedradas, casas blancas y vistas al Cañón del Chicamocha.",
      altitude: 1336,
      weather: "Templado seco, 22°C promedio",
      population: 9000,
      latitude: 6.6352,
      longitude: -73.2341,
    },
  })

  const sanGil = await prisma.municipality.upsert({
    where: { slug: "san-gil" },
    update: {},
    create: {
      name: "San Gil",
      slug: "san-gil",
      description: "Capital del turismo de aventura en Colombia. Rafting, parapente y rappel en el Cañón del Chicamocha.",
      altitude: 1114,
      weather: "Templado, 23°C promedio",
      population: 50000,
      latitude: 6.5564,
      longitude: -73.1360,
    },
  })

  const curiti = await prisma.municipality.upsert({
    where: { slug: "curiti" },
    update: {},
    create: {
      name: "Curití",
      slug: "curiti",
      description: "Municipio artesanal famoso por la fique y las cascadas naturales cercanas.",
      altitude: 1150,
      weather: "Templado, 21°C promedio",
      population: 12000,
      latitude: 6.6167,
      longitude: -73.0833,
    },
  })

  console.log("✅ Municipios creados")

  // CATEGORÍAS
  const catNaturaleza = await prisma.category.upsert({
    where: { slug: "naturaleza" },
    update: {},
    create: {
      name: "Naturaleza",
      slug: "naturaleza",
      icon: "🌿",
      color: "#16a34a",
    },
  })

  const catAventura = await prisma.category.upsert({
    where: { slug: "aventura" },
    update: {},
    create: {
      name: "Aventura",
      slug: "aventura",
      icon: "🧗",
      color: "#ea580c",
    },
  })

  const catCultural = await prisma.category.upsert({
    where: { slug: "cultural" },
    update: {},
    create: {
      name: "Cultural",
      slug: "cultural",
      icon: "🏛️",
      color: "#7c3aed",
    },
  })

  const catMirador = await prisma.category.upsert({
    where: { slug: "mirador" },
    update: {},
    create: {
      name: "Miradores",
      slug: "mirador",
      icon: "🔭",
      color: "#0284c7",
    },
  })

  const catCascada = await prisma.category.upsert({
    where: { slug: "cascada" },
    update: {},
    create: {
      name: "Cascadas",
      slug: "cascada",
      icon: "💧",
      color: "#0891b2",
    },
  })

  const catPueblo = await prisma.category.upsert({
    where: { slug: "pueblo" },
    update: {},
    create: {
      name: "Pueblos",
      slug: "pueblo",
      icon: "🏘️",
      color: "#b45309",
    },
  })

  console.log("✅ Categorías creadas")

  // LUGARES
  await prisma.place.upsert({
    where: { slug: "canon-del-chicamocha" },
    update: {},
    create: {
      name: "Cañón del Chicamocha",
      slug: "canon-del-chicamocha",
      description: "Uno de los cañones más impresionantes de Colombia con más de 2.000 metros de profundidad. El Parque Nacional del Chicamocha ofrece teleférico, deportes extremos y vistas panorámicas espectaculares.",
      images: [],
      tips: [
        "Visita en la mañana para evitar el calor extremo del mediodía",
        "Lleva protector solar y agua suficiente",
        "El teleférico tiene capacidad limitada, llega temprano",
        "La mejor época es entre diciembre y marzo"
      ],
      bestTime: "Diciembre a marzo",
      difficulty: Difficulty.EASY,
      entryFee: 45000,
      address: "Km 48 vía Bucaramanga - San Gil",
      latitude: 6.8500,
      longitude: -73.0500,
      featured: true,
      status: Status.PUBLISHED,
      municipalityId: sanGil.id,
      categoryId: catNaturaleza.id,
    },
  })

  await prisma.place.upsert({
    where: { slug: "barichara-pueblo" },
    update: {},
    create: {
      name: "Centro histórico de Barichara",
      slug: "barichara-pueblo",
      description: "Declarado Monumento Nacional de Colombia, Barichara es considerado el pueblo más bonito del país. Sus calles empedradas, iglesias coloniales y casas blancas con tejas de barro lo hacen único.",
      images: [],
      tips: [
        "Camina el Camino Real hacia Guane, son 9 km de paisaje espectacular",
        "Visita la Fundación Escuela Taller para ver artesanías locales",
        "Los atardeceres desde el mirador son imperdibles",
        "Madruga para ver el pueblo sin turistas"
      ],
      bestTime: "Todo el año",
      difficulty: Difficulty.EASY,
      entryFee: 0,
      address: "Barichara, Santander",
      latitude: 6.6352,
      longitude: -73.2341,
      featured: true,
      status: Status.PUBLISHED,
      municipalityId: barichara.id,
      categoryId: catPueblo.id,
    },
  })

  await prisma.place.upsert({
    where: { slug: "cascada-juan-curi" },
    update: {},
    create: {
      name: "Cascada Juan Curí",
      slug: "cascada-juan-curi",
      description: "Una de las cascadas más altas de Santander con 180 metros de caída libre. Rodeada de vegetación tropical, es ideal para rappel y natación en sus pozos naturales.",
      images: [],
      tips: [
        "Lleva ropa de cambio y sandalias para el agua",
        "Puedes hacer rappel con operadores locales desde $50.000",
        "El sendero hasta la cascada toma 20 minutos caminando",
        "Evita ir en temporada de lluvias por el caudal"
      ],
      bestTime: "Enero a marzo, julio a agosto",
      difficulty: Difficulty.MODERATE,
      entryFee: 10000,
      address: "Vía Charalá, Santander",
      latitude: 6.2833,
      longitude: -73.1667,
      featured: true,
      status: Status.PUBLISHED,
      municipalityId: curiti.id,
      categoryId: catCascada.id,
    },
  })

  await prisma.place.upsert({
    where: { slug: "rafting-rio-fonce" },
    update: {},
    create: {
      name: "Rafting río Fonce",
      slug: "rafting-rio-fonce",
      description: "El río Fonce en San Gil ofrece una de las mejores experiencias de rafting en Colombia con rápidos de nivel 3 y 4. Operadores locales certificados garantizan seguridad y diversión.",
      images: [],
      tips: [
        "Reserva con al menos un día de anticipación en temporada alta",
        "No necesitas experiencia previa",
        "Lleva ropa que pueda mojarse y no uses cámara sin protección",
        "El recorrido dura aproximadamente 2 horas"
      ],
      bestTime: "Todo el año",
      difficulty: Difficulty.MODERATE,
      entryFee: 80000,
      address: "San Gil, Santander",
      latitude: 6.5564,
      longitude: -73.1360,
      featured: true,
      status: Status.PUBLISHED,
      municipalityId: sanGil.id,
      categoryId: catAventura.id,
    },
  })

  await prisma.place.upsert({
    where: { slug: "parque-wilches-bucaramanga" },
    update: {},
    create: {
      name: "Parque García Rovira",
      slug: "parque-wilches-bucaramanga",
      description: "El corazón histórico de Bucaramanga, rodeado de arquitectura republicana, la Catedral de la Sagrada Familia y cafeterías tradicionales. Punto de encuentro cultural de la ciudad.",
      images: [],
      tips: [
        "Visita en la tarde cuando los locales salen a caminar",
        "Los fines de semana hay eventos culturales gratuitos",
        "Prueba el café y los bocadillos en los cafés del parque"
      ],
      bestTime: "Todo el año",
      difficulty: Difficulty.EASY,
      entryFee: 0,
      address: "Centro histórico, Bucaramanga",
      latitude: 7.1254,
      longitude: -73.1198,
      featured: false,
      status: Status.PUBLISHED,
      municipalityId: bucaramanga.id,
      categoryId: catCultural.id,
    },
  })

  await prisma.place.upsert({
    where: { slug: "mirador-santander-giron" },
    update: {},
    create: {
      name: "Mirador del Río de Oro - Girón",
      slug: "mirador-santander-giron",
      description: "Desde este mirador en el pueblo colonial de Girón se aprecia una vista panorámica del río de Oro y la arquitectura republicana del municipio, Patrimonio Histórico de Colombia.",
      images: [],
      tips: [
        "El pueblo se recorre perfectamente a pie en 2-3 horas",
        "Visita la iglesia parroquial del siglo XVIII",
        "Prueba los dulces y masatos típicos en las tiendas del parque"
      ],
      bestTime: "Todo el año",
      difficulty: Difficulty.EASY,
      entryFee: 0,
      address: "Girón, Santander",
      latitude: 7.0731,
      longitude: -73.1678,
      featured: false,
      status: Status.PUBLISHED,
      municipalityId: giron.id,
      categoryId: catMirador.id,
    },
  })

  console.log("✅ Lugares creados")

  // ALOJAMIENTOS
  await prisma.accommodation.upsert({
    where: { slug: "glamping-monte-azul" },
    update: {},
    create: {
      name: "Glamping Monte Azul",
      slug: "glamping-monte-azul",
      description: "Experiencia de glamping en medio de la naturaleza con vistas privilegiadas al área metropolitana de Bucaramanga. Domos y carpas de lujo con camas cómodas, desayuno incluido y ambiente romántico ideal para parejas.",
      type: AccommodationType.GLAMPING,
      images: [],
      priceMin: 280000,
      priceMax: 450000,
      amenities: [
        "Desayuno incluido",
        "Cama doble con ropa de cama premium",
        "Baño privado",
        "Vista panorámica",
        "Fogata nocturna",
        "WiFi",
        "Parqueadero"
      ],
      idealFor: IdealFor.PAREJAS,
      capacity: 2,
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      contactUrl: "https://wa.me/573001234567",
      address: "Floridablanca, Santander",
      latitude: 7.0639,
      longitude: -73.0877,
      status: Status.PUBLISHED,
      municipalityId: floridablanca.id,
    },
  })

  await prisma.accommodation.upsert({
    where: { slug: "glamping-la-piramide" },
    update: {},
    create: {
      name: "Glamping La Pirámide",
      slug: "glamping-la-piramide",
      description: "Glamping con domos geodésicos en forma de pirámide rodeados de naturaleza santandereana. Precio accesible comparado con glampings premium, perfecto para escapadas románticas de fin de semana.",
      type: AccommodationType.GLAMPING,
      images: [],
      priceMin: 180000,
      priceMax: 320000,
      amenities: [
        "Desayuno incluido",
        "Domo geodésico privado",
        "Jacuzzi",
        "Vista a la montaña",
        "Senderos naturales",
        "Parqueadero gratuito"
      ],
      idealFor: IdealFor.PAREJAS,
      capacity: 2,
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      contactUrl: "https://wa.me/573009876543",
      address: "Floridablanca, Santander",
      latitude: 7.0500,
      longitude: -73.0800,
      status: Status.PUBLISHED,
      municipalityId: floridablanca.id,
    },
  })

  await prisma.accommodation.upsert({
    where: { slug: "hotel-ruitoque" },
    update: {},
    create: {
      name: "Hotel Campestre Ruitoque",
      slug: "hotel-ruitoque",
      description: "Hotel campestre con piscina, zonas verdes y vistas al cañón. Ideal para familias que buscan descanso y naturaleza cerca de Bucaramanga.",
      type: AccommodationType.HOTEL,
      images: [],
      priceMin: 150000,
      priceMax: 280000,
      amenities: [
        "Piscina",
        "Restaurante",
        "WiFi",
        "Parqueadero",
        "Zonas verdes",
        "Aire acondicionado",
        "TV cable"
      ],
      idealFor: IdealFor.FAMILIAS,
      capacity: 4,
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      contactUrl: "https://wa.me/573005555555",
      address: "Km 12 vía Floridablanca",
      latitude: 7.0400,
      longitude: -73.0600,
      status: Status.PUBLISHED,
      municipalityId: floridablanca.id,
    },
  })

  await prisma.accommodation.upsert({
    where: { slug: "hostal-barichara-colonial" },
    update: {},
    create: {
      name: "Hostal Colonial Barichara",
      slug: "hostal-barichara-colonial",
      description: "Hostal ubicado en una casona colonial restaurada en el centro de Barichara. Ambiente auténtico, patio interior con jardín y la mejor ubicación para explorar el pueblo a pie.",
      type: AccommodationType.HOSTAL,
      images: [],
      priceMin: 60000,
      priceMax: 120000,
      amenities: [
        "WiFi",
        "Cocina compartida",
        "Patio colonial",
        "Lockers",
        "Agua caliente",
        "Zona de hamacas"
      ],
      idealFor: IdealFor.TODOS,
      capacity: 8,
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      contactUrl: "https://wa.me/573007777777",
      address: "Calle 5 #4-32, Barichara",
      latitude: 6.6340,
      longitude: -73.2330,
      status: Status.PUBLISHED,
      municipalityId: barichara.id,
    },
  })

  console.log("✅ Alojamientos creados")

  // RESTAURANTES
  await prisma.restaurant.upsert({
    where: { slug: "restaurante-leal-bucaramanga" },
    update: {},
    create: {
      name: "Restaurante El Viejo Chiflas",
      slug: "restaurante-leal-bucaramanga",
      description: "Restaurante tradicional santandereano con más de 30 años sirviendo los platos más auténticos de la región.",
      foodType: "Comida típica santandereana",
      specialties: ["Mute santandereano", "Cabro guisado", "Pepitoria", "Arepa de maíz pelado", "Chicha de maíz"],
      priceAvg: 25000,
      rating: 4.5,
      images: [],
      schedule: "Lunes a domingo 7:00 AM - 9:00 PM",
      phone: "+57 300 123 4567",
      address: "Calle 35 #28-42, Bucaramanga",
      status: Status.PUBLISHED,
      municipalityId: bucaramanga.id,
    },
  })

  await prisma.restaurant.upsert({
    where: { slug: "restaurante-barichara-plaza" },
    update: {},
    create: {
      name: "La Casona de Barichara",
      slug: "restaurante-barichara-plaza",
      description: "Restaurante en una casona colonial frente al parque principal de Barichara. Cocina regional con ingredientes locales y vistas al pueblo patrimonial.",
      foodType: "Cocina regional colombiana",
      specialties: ["Trucha del río", "Hormigas culonas", "Caldo de costilla", "Tamal santandereano"],
      priceAvg: 35000,
      rating: 4.7,
      images: [],
      schedule: "Martes a domingo 12:00 PM - 9:00 PM",
      phone: "+57 301 987 6543",
      address: "Carrera 6 #5-27, frente al parque, Barichara",
      status: Status.PUBLISHED,
      municipalityId: barichara.id,
    },
  })

  await prisma.restaurant.upsert({
    where: { slug: "restaurante-san-gil-aventura" },
    update: {},
    create: {
      name: "Gringo Mike's San Gil",
      slug: "restaurante-san-gil-aventura",
      description: "El punto de encuentro de los aventureros en San Gil. Comida internacional y colombiana, cervezas artesanales y el mejor ambiente después de un día de rafting.",
      foodType: "Internacional y colombiana",
      specialties: ["Hamburguesas artesanales", "Nachos", "Bandeja paisa", "Jugos naturales"],
      priceAvg: 28000,
      rating: 4.3,
      images: [],
      schedule: "Todos los días 11:00 AM - 11:00 PM",
      phone: "+57 302 456 7890",
      address: "Carrera 10 #12-23, San Gil",
      status: Status.PUBLISHED,
      municipalityId: sanGil.id,
    },
  })

  console.log("✅ Restaurantes creados")

  // USUARIO ADMIN
  await prisma.user.upsert({
    where: { email: "admin@descubresantander.com" },
    update: {},
    create: {
      email: "admin@descubresantander.com",
      name: "Administrador",
      role: Role.ADMIN,
    },
  })

  console.log("✅ Usuario admin creado")
  console.log("🎉 Seed completado exitosamente")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })