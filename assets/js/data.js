// =============================================================
// RECIPES DATA — Versión de muestra
// Para producción: cargar desde data/index.json + recetas/*.json
// =============================================================

window.RECIPES_DATA = [
  {
    id: "smoothie-verde-tropical",
    titulo: "Smoothie verde tropical",
    categoria: "Bebidas",
    descripcion: "Espinaca, piña y jengibre con leche de coco. Energía fría para arrancar el día sin culpa.",
    foto: null,
    tiempoMin: 5,
    porciones: 1,
    dificultad: "Muy fácil",
    dificultadLabel: "01",
    macros: {
      kcal: 198,
      proteina: 6,
      carbohidratos: 32,
      grasas: 5,
      fibra: 7
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Espinaca baby", cantidad: "1 taza" },
      { item: "Piña troceada congelada", cantidad: "1 taza" },
      { item: "Leche de coco ligera", cantidad: "200 ml" },
      { item: "Jengibre fresco rallado", cantidad: "1 cdta" },
      { item: "Jugo de lima", cantidad: "½ unidad" },
      { item: "Miel cruda", cantidad: "1 cda (opcional)" }
    ],
    pasos: [
      { titulo: "Lavar y preparar", texto: "Lava bien las hojas de espinaca y trocea la piña si la usas fresca. Pela el jengibre y rállalo fino con un microplane." },
      { titulo: "Licuar en frío", texto: "Coloca primero los líquidos (leche de coco + lima) en la licuadora, después las hojas y al final la piña congelada para que baje la temperatura rápido." },
      { titulo: "Textura sedosa", texto: "Licúa a máxima potencia durante 45 segundos. Si queda muy espeso, añade un chorrito más de leche de coco hasta conseguir un color verde jade homogéneo." },
      { titulo: "Servir inmediatamente", texto: "Vierte en un vaso ancho, decora con una rodaja de lima y bebe enseguida para no perder las enzimas activas de la espinaca." }
    ],
    tags: ["vegano", "sin-gluten", "express", "detox"]
  },
  {
    id: "avena-overnight-chia",
    titulo: "Avena overnight con chía",
    categoria: "Desayuno",
    descripcion: "Avena remojada toda la noche con semillas de chía, yogur griego y frutos rojos. Cero cocción.",
    foto: null,
    tiempoMin: 5,
    tiempoReposo: "8h",
    porciones: 1,
    dificultad: "Muy fácil",
    dificultadLabel: "01",
    macros: {
      kcal: 412,
      proteina: 22,
      carbohidratos: 58,
      grasas: 11,
      fibra: 12
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Avena en hojuelas", cantidad: "60 g" },
      { item: "Semillas de chía", cantidad: "1 cda" },
      { item: "Yogur griego natural", cantidad: "150 g" },
      { item: "Leche de almendras", cantidad: "100 ml" },
      { item: "Frutos rojos mixtos", cantidad: "½ taza" },
      { item: "Miel de maple", cantidad: "1 cda" },
      { item: "Canela en polvo", cantidad: "una pizca" }
    ],
    pasos: [
      { titulo: "Mezcla base", texto: "En un frasco de vidrio con tapa, mezcla la avena, las semillas de chía, la canela y la leche vegetal. Remueve bien para que no queden grumos secos en el fondo." },
      { titulo: "Refrigerar", texto: "Tapa y lleva al frigorífico un mínimo de 6 horas, idealmente toda la noche. Las semillas de chía formarán un gel que espesa todo." },
      { titulo: "Por la mañana, montar", texto: "Saca del frigo, añade una capa generosa de yogur griego por encima y remueve ligeramente para crear vetas. Vierte el sirope de maple en hilo fino." },
      { titulo: "Decorar y comer", texto: "Cubre con los frutos rojos frescos o congelados y un extra de chía si te gusta el crunch. Puedes comerlo directamente o llevártelo al trabajo." }
    ],
    tags: ["sin-cocción", "alto-en-fibra", "meal-prep"]
  },
  {
    id: "bowl-de-quinoa-mediterraneo",
    titulo: "Bowl de quinoa mediterráneo",
    categoria: "Almuerzo",
    descripcion: "Quinoa, garbanzos tostados, tomates cherry, aceitunas Kalamata y aderezo de tahini con limón.",
    foto: null,
    tiempoMin: 25,
    porciones: 2,
    dificultad: "Fácil",
    dificultadLabel: "02",
    macros: {
      kcal: 524,
      proteina: 19,
      carbohidratos: 68,
      grasas: 19,
      fibra: 14
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Quinoa tricolor", cantidad: "150 g" },
      { item: "Garbanzos cocidos", cantidad: "200 g" },
      { item: "Tomates cherry", cantidad: "200 g" },
      { item: "Aceitunas Kalamata", cantidad: "60 g" },
      { item: "Pepino persa", cantidad: "1 unidad" },
      { item: "Perejil fresco", cantidad: "un manojo" },
      { item: "Tahini de sésamo", cantidad: "2 cdas" },
      { item: "Jugo de limón", cantidad: "1 unidad" },
      { item: "Comino molido", cantidad: "½ cdta" }
    ],
    pasos: [
      { titulo: "Cocinar la quinoa", texto: "Enjuaga la quinoa bajo agua fría durante 1 minuto para quitarle el sabor amargo. Cocínala en doble volumen de agua con una pizca de sal durante 15 minutos a fuego bajo. Apaga, tapa y deja reposar 5 minutos más." },
      { titulo: "Tostar garbanzos", texto: "Escurre y seca bien los garbanzos con un paño. Saltéalos en sartén caliente con aceite de oliva, comino y pimentón hasta que queden crujientes por fuera (8–10 min). Sala al final." },
      { titulo: "Vegetales en cubo", texto: "Parte los tomates cherry por la mitad, el pepino en medias lunas finas y pica el perejil groseramente. Deshuesa las aceitunas si lo prefieres." },
      { titulo: "Aliñar y montar", texto: "Bate tahini con el jugo de limón y 3–4 cucharadas de agua hasta obtener una crema sedosa. Monta bowls con quinoa como base, reparte vegetales, garbanzos tostados encima y riega con el aderezo." }
    ],
    tags: ["vegano", "alto-en-fibra", "mediterráneo", "meal-prep"]
  },
  {
    id: "salmon-al-horno-limon",
    titulo: "Salmón al horno con limón y eneldo",
    categoria: "Comida",
    descripcion: "Filete de salmón al horno con costra de mostaza Dijon, eneldo fresco y rodajas de limón. Listo en 18 min.",
    foto: null,
    tiempoMin: 18,
    porciones: 2,
    dificultad: "Media",
    dificultadLabel: "03",
    macros: {
      kcal: 482,
      proteina: 38,
      carbohidratos: 8,
      grasas: 32,
      fibra: 2
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Filete de salmón con piel", cantidad: "400 g" },
      { item: "Mostaza Dijon", cantidad: "2 cdas" },
      { item: "Miel cruda", cantidad: "1 cda" },
      { item: "Eneldo fresco", cantidad: "un manojo pequeño" },
      { item: "Limón", cantidad: "1 unidad" },
      { item: "Aceite de oliva virgen extra", cantidad: "2 cdas" },
      { item: "Sal marina y pimienta", cantidad: "al gusto" }
    ],
    pasos: [
      { titulo: "Precalentar y preparar", texto: "Calienta el horno a 200°C con calor arriba y abajo. Forra una bandeja con papel vegetal. Seca el salmón con papel de cocina para que la piel quede crujiente." },
      { titulo: "Costra aromática", texto: "Mezcla en un bol la mostaza, la miel, una cucharada de aceite, la ralladura de medio limón y la mitad del eneldo picado fino. Unta esta pasta sobre la cara del salmón (no la piel)." },
      { titulo: "Horno breve", texto: "Coloca el salmón con la piel hacia abajo sobre la bandeja. Rodéalo con rodajas finas de limón. Hornea 12–14 minutos: el interior debe quedar jugoso y la costra caramelizada." },
      { titulo: "Terminar y servir", texto: "Saca del horno y deja reposar 2 minutos. Espolvorea el resto del eneldo y un hilo de aceite de oliva en crudo. Sirve con espárragos verdes salteados o couscous." }
    ],
    tags: ["omega-3", "alto-en-proteína", "low-carb"]
  },
  {
    id: "curry-de-lentejas-rojas",
    titulo: "Curry de lentejas rojas con leche de coco",
    categoria: "Cena",
    descripcion: "Lentejas rojas guisadas con leche de coco, cúrcuma, jengibre y tomate. Reconfortante y barato.",
    foto: null,
    tiempoMin: 35,
    porciones: 3,
    dificultad: "Fácil",
    dificultadLabel: "02",
    macros: {
      kcal: 446,
      proteina: 22,
      carbohidratos: 62,
      grasas: 12,
      fibra: 18
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Lentejas rojas", cantidad: "200 g" },
      { item: "Leche de coco", cantidad: "400 ml" },
      { item: "Tomate triturado", cantidad: "200 g" },
      { item: "Cebolla morada", cantidad: "1 unidad" },
      { item: "Ajo", cantidad: "3 dientes" },
      { item: "Jengibre fresco", cantidad: "trozo de 3 cm" },
      { item: "Cúrcuma en polvo", cantidad: "1 cdta" },
      { item: "Comino molido", cantidad: "1 cdta" },
      { item: "Garam masala", cantidad: "1 cdta" },
      { item: "Aceite de coco", cantidad: "1 cda" },
      { item: "Zumo de lima", cantidad: "½ unidad" }
    ],
    pasos: [
      { titulo: "Base aromática", texto: "Calienta el aceite de coco a fuego medio. Sofríe la cebolla picada fina con un pellizco de sal durante 5 minutos hasta que esté translúcida. Añade ajo y jengibre rallados, cocina 2 minutos más." },
      { titulo: "Especias", texto: "Incorpora la cúrcuma, el comino y el garam masala. Tuesta las especias 60 segundos removiendo para que liberen sus aceites esenciales sin quemarse." },
      { titulo: "Guiso lento", texto: "Vierte el tomate triturado y deja reducir 3 minutos. Añade las lentejas enjuagadas y la leche de coco. Cocina a fuego suave durante 22–25 minutos, removiendo de vez en cuando, hasta que las lentejas se deshagan y la salsa espese." },
      { titulo: "Terminar", texto: "Apaga el fuego y exprime el medio limón. Rectifica sal. Sirve en cuencos hondos sobre arroz basmati o con pan naan caliente, decorado con cilantro fresco y un chorrito de leche de coco." }
    ],
    tags: ["vegano", "alto-en-fibra", "una-olla", "batch-cooking"]
  },
  {
    id: "tortitas-avena-banana",
    titulo: "Tortitas de avena y plátano",
    categoria: "Desayuno",
    descripcion: "Solo tres ingredientes: avena, plátano maduro y huevos. Tortitas esponjosas sin azúcar añadido.",
    foto: null,
    tiempoMin: 12,
    porciones: 2,
    dificultad: "Muy fácil",
    dificultadLabel: "01",
    macros: {
      kcal: 348,
      proteina: 18,
      carbohidratos: 48,
      grasas: 9,
      fibra: 6
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Plátano muy maduro", cantidad: "1 grande" },
      { item: "Huevos camperos", cantidad: "2 unidades" },
      { item: "Copos de avena finos", cantidad: "60 g" },
      { item: "Canela en polvo", cantidad: "½ cdta" },
      { item: "Mantequilla o aceite de coco", cantidad: "para cocinar" }
    ],
    pasos: [
      { titulo: "Triturar masa", texto: "En un bol grande, machaca el plátano con un tenedor hasta hacer puré. Bate los huevos e incorpóralos al puré. Añade la avena y la canela, mezcla y deja reposar 5 minutos para que la avena absorba líquido." },
      { titulo: "Cocinar a fuego bajo", texto: "Calienta una sartén antiadherente a fuego medio-bajo con un poquito de mantequilla. Vierte una porción de masa (unos 3 cm de diámetro). Cocina 2 minutos por cada lado hasta que aparezcan burbujas en la superficie." },
      { titulo: "Presentar", texto: "Apila las tortitas en un plato. Acompaña con yogur griego, más rodajas de plátano, un hilo de miel cruda y nueces troceadas. Espolvorea canela por encima." }
    ],
    tags: ["sin-azúcar", "alto-en-proteína", "post-entreno"]
  },
  {
    id: "ensalada-tempeh-aguacate",
    titulo: "Ensalada de tempeh y aguacate",
    categoria: "Almuerzo",
    descripcion: "Tempeh crujiente, aguacate Hass, edamame y vinagreta de miso. Bowl vegetariano potente.",
    foto: null,
    tiempoMin: 20,
    porciones: 2,
    dificultad: "Fácil",
    dificultadLabel: "02",
    macros: {
      kcal: 478,
      proteina: 28,
      carbohidratos: 32,
      grasas: 27,
      fibra: 13
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Tempeh", cantidad: "200 g" },
      { item: "Aguacate Hass maduro", cantidad: "1 unidad" },
      { item: "Edamame (soja)", cantidad: "150 g" },
      { item: "Mezcla de hojas verdes", cantidad: "100 g" },
      { item: "Zanahoria rallada", cantidad: "1 unidad" },
      { item: "Pasta de miso blanco", cantidad: "1 cda" },
      { item: "Aceite de sésamo tostado", cantidad: "1 cdta" },
      { item: "Vinagre de arroz", cantidad: "1 cda" },
      { item: "Salsa tamari o soja", cantidad: "1 cda" }
    ],
    pasos: [
      { titulo: "Marinar tempeh", texto: "Corta el tempeh en cubos pequeños. Marina 10 minutos con salsa de soja y una pizca de aceite. Después saltéalo en sartén bien caliente hasta que se dore y quede crujiente por fuera (8 min)." },
      { titulo: "Vinagreta umami", texto: "Bate en un bol pequeño la pasta de miso con el vinagre de arroz, el aceite de sésamo y dos cucharadas de agua tibia hasta emulsionar. Si queda muy espeso, añade agua gota a gota." },
      { titulo: "Montar bowls", texto: "Reparte las hojas verdes en la base. Añade tiras de zanahoria, los edamame descongelados, el aguacate en gajos y los cubos crujientes de tempeh por encima." },
      { titulo: "Aliñar al final", texto: "Riega con la vinagreta justo antes de comer para que las hojas no se ablanden. Decora con semillas de sésamo negro y unas tiras de cebollino." }
    ],
    tags: ["vegano", "alto-en-proteína", "sin-gluten"]
  },
  {
    id: "pasta-pesto-albahaca",
    titulo: "Pasta con pesto casero de albahaca",
    categoria: "Cena",
    descripcion: "Pasta corta con pesto de albahaca fresca, piñones tostados, parmesano y un toque de limón.",
    foto: null,
    tiempoMin: 22,
    porciones: 3,
    dificultad: "Fácil",
    dificultadLabel: "02",
    macros: {
      kcal: 562,
      proteina: 21,
      carbohidratos: 72,
      grasas: 22,
      fibra: 5
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Pasta corta (fusilli o casarecce)", cantidad: "300 g" },
      { item: "Albahaca fresca", cantidad: "60 g" },
      { item: "Piñones", cantidad: "40 g" },
      { item: "Queso parmesano rallado", cantidad: "60 g" },
      { item: "Ajo", cantidad: "1 diente pequeño" },
      { item: "Aceite de oliva virgen extra", cantidad: "80 ml" },
      { item: "Zumo de limón", cantidad: "½ unidad" },
      { item: "Sal y pimienta negra", cantidad: "al gusto" },
      { item: "Tomates cherry", cantidad: "150 g (para servir)" }
    ],
    pasos: [
      { titulo: "Pesto en mortero", texto: "Tuesta los piñones en sartén seca hasta que estén dorados (3 min, ojo que se queman). En un mortero o procesador, machaca el ajo con los piñones y una pizca de sal. Añade la albahaca y sigue trabajando. Por último, el parmesano y el aceite en hilo fino hasta emulsionar." },
      { titulo: "Pasta al dente", texto: "Hierve abundante agua con sal (10 g por litro). Cocina la pasta 1 minuto menos de lo que indique el paquete. Guarda 1 taza del agua de cocción antes de escurrir." },
      { titulo: "Mantecar con el agua", texto: "Vuelve a poner la pasta en la olla caliente (fuera del fuego). Añade el pesto y dos o tres cucharadas del agua de cocción. Remueve enérgicamente para que el almidón ligue la salsa." },
      { titulo: "Servir", texto: "Reparte en platos hondos. Decora con tomates cherry partidos por la mitad, láminas de parmesano, un hilo de AOVE en crudo y unas hojas de albahaca fresca. Pimienta recién molida." }
    ],
    tags: ["vegetariano", "italiano", "comfort-food"]
  },
  {
    id: "te-matcha-latte",
    titulo: "Matcha latte con avena",
    categoria: "Bebidas",
    descripcion: "Matcha ceremonial batido con leche de avena espumada. Ritual tranquilo para media tarde.",
    foto: null,
    tiempoMin: 4,
    porciones: 1,
    dificultad: "Muy fácil",
    dificultadLabel: "01",
    macros: {
      kcal: 134,
      proteina: 4,
      carbohidratos: 18,
      grasas: 5,
      fibra: 1
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Matcha ceremonial en polvo", cantidad: "1–2 g (1 cdta)" },
      { item: "Agua caliente a 80°C", cantidad: "60 ml" },
      { item: "Leche de avena (u otra vegetal)", cantidad: "200 ml" },
      { item: "Miel o sirope de agave", cantidad: "1 cda (opcional)" }
    ],
    pasos: [
      { titulo: "Tamizar el matcha", texto: "Tamiza el polvo de matcha por un colador fino directamente en tu cuenco o taza. Este paso es clave: evita grumos y deja una textura aterciopelada." },
      { titulo: "Batir con chasen", texto: "Añade el agua caliente (no hirviendo, para no amargar) y bate enérgicamente con un batidor de bambú (chasen) en movimientos rápidos en W durante 20–30 segundos hasta formar espuma." },
      { titulo: "Espumar la leche", texto: "Calienta la leche de avena sin que llegue a hervir. Espúmala con un espumador manual o vaporizador hasta duplicar su volumen." },
      { titulo: "Montar y endulzar", texto: "Vierte lentamente la leche espumada sobre el matcha con un movimiento circular para crear la capa superior. Dibuja un corazón con un palillo sobre la espuma. Endulza al gusto." }
    ],
    tags: ["vegano", "antioxidante", "sin-caféína-pesada"]
  },
  {
    id: "huevos-rovueltos-aguacate",
    titulo: "Huevos revueltos con aguacate y tostada",
    categoria: "Desayuno",
    descripcion: "Tres huevos revueltos cremosos con crema de aguacate y pan de masa madre. Domingo lento.",
    foto: null,
    tiempoMin: 10,
    porciones: 1,
    dificultad: "Muy fácil",
    dificultadLabel: "01",
    macros: {
      kcal: 528,
      proteina: 26,
      carbohidratos: 32,
      grasas: 34,
      fibra: 9
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Huevos camperos", cantidad: "3 unidades" },
      { item: "Mantequilla sin sal", cantidad: "1 cda" },
      { item: "Nata para montar (opcional)", cantidad: "1 cda" },
      { item: "Aguacate", cantidad: "½ unidad" },
      { item: "Zumo de lima", cantidad: "1 cdta" },
      { item: "Pan de masa madre", cantidad: "2 rebanadas gruesas" },
      { item: "Sal en escamas y pimienta", cantidad: "al gusto" },
      { item: "Cebollino fresco", cantidad: "para decorar" }
    ],
    pasos: [
      { titulo: "Crema de aguacate", texto: "Machaca la mitad del aguacate con el zumo de lima, una pizca de sal y un chorrito de aceite de oliva hasta obtener una pasta rústica con textura." },
      { titulo: "Tostar el pan", texto: "Tuesta el pan de masa madre hasta que esté crujiente por fuera pero tierno por dentro. Unta generosamente con la crema de aguacate." },
      { titulo: "Revueltos lentos", texto: "Bate los huevos con una pizca de sal. Derrite la mantequilla a fuego muy bajo en sartén antiadherente. Cuando haga espuma, vierte los huevos. Remueve constantemente con espátula de silicona, retirando del fuego cuando aún estén húmedos (residual los termina)." },
      { titulo: "Presentar", texto: "Sirve los revueltos sobre las tostadas con aguacate. Decora con escamas de sal, tres vueltas de molino de pimienta y cebollino picado por encima." }
    ],
    tags: ["alto-en-proteína", "brunch", "sin-azúcar"]
  },
  {
    id: "wrap-polllo-cacahuete",
    titulo: "Wrap de pollo con mantequilla de cacahuete",
    categoria: "Almuerzo",
    descripcion: "Tortilla integral con pollo, mantequilla de cacahuete, pepino, zanahoria y un toque de sriracha.",
    foto: null,
    tiempoMin: 12,
    porciones: 1,
    dificultad: "Fácil",
    dificultadLabel: "02",
    macros: {
      kcal: 596,
      proteina: 42,
      carbohidratos: 48,
      grasas: 24,
      fibra: 7
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Tortilla integral grande", cantidad: "1 unidad" },
      { item: "Pechuga de pollo a la plancha", cantidad: "120 g" },
      { item: "Mantequilla de cacahuete natural", cantidad: "1 cda" },
      { item: "Salsa sriracha", cantidad: "1 cdta" },
      { item: "Pepino", cantidad: "½ unidad" },
      { item: "Zanahoria", cantidad: "1 unidad pequeña" },
      { item: "Cebollino", cantidad: "3 tallos" },
      { item: "Lima", cantidad: "¼ unidad" }
    ],
    pasos: [
      { titulo: "Calentar tortilla", texto: "Calienta la tortilla 20 segundos en sartén seca o en el microondas para que sea flexible y no se rompa al doblar." },
      { titulo: "Salsa cremosa", texto: "Mezcla la mantequilla de cacahuete con la sriracha y un chorrito de agua tibia hasta obtener una salsa vertible pero espesa. Ajusta picante a tu gusto." },
      { titulo: "Cortar y montar", texto: "Corta el pollo en tiras, el pepino y la zanahoria en juliana fina. Unta la tortilla con la salsa de cacahuete, dejando un borde limpio de 2 cm." },
      { titulo: "Enrollar firme", texto: "Coloca los rellenos en el tercio inferior, espolvorea cebollino y unas gotas de lima. Dobla los laterales hacia dentro y enrolla apretando bien. Corta por la mitad en diagonal." }
    ],
    tags: ["exprés", "alto-en-proteína", "tupper-amigo"]
  },
  {
    id: "sopa-calabaza-jengibre",
    titulo: "Sopa de calabaza asada y jengibre",
    categoria: "Cena",
    descripcion: "Crema aterciopelada de calabaza asada con coco, un toque de jengibre y pipas tostadas por encima.",
    foto: null,
    tiempoMin: 55,
    porciones: 4,
    dificultad: "Media",
    dificultadLabel: "03",
    macros: {
      kcal: 268,
      proteina: 7,
      carbohidratos: 32,
      grasas: 13,
      fibra: 8
    },
    macrosPorPorcion: true,
    ingredientes: [
      { item: "Calabaza butternut pelada", cantidad: "1.2 kg" },
      { item: "Leche de coco", cantidad: "200 ml" },
      { item: "Caldo de verduras", cantidad: "500 ml" },
      { item: "Cebolla", cantidad: "1 unidad" },
      { item: "Ajo", cantidad: "3 dientes" },
      { item: "Jengibre fresco", cantidad: "trozo de 4 cm" },
      { item: "Pipas de calabaza", cantidad: "40 g" },
      { item: "Aceite de oliva virgen extra", cantidad: "3 cdas" },
      { item: "Comino molido", cantidad: "1 cdta" },
      { item: "Sal marina y nuez moscada", cantidad: "al gusto" }
    ],
    pasos: [
      { titulo: "Asar calabaza", texto: "Corta la calabaza en dados de 3 cm. Mezcla con 2 cucharadas de aceite, comino, sal y pimienta. Extiende en bandeja con espacio entre piezas. Asa a 200°C durante 30–35 minutos hasta que esté dorada y tierna." },
      { titulo: "Soffritto aromático", texto: "Mientras, pocha la cebolla picada fina con el jengibre rallado en una olla grande con una cucharada de aceite durante 8 minutos hasta que esté transparente y dulce." },
      { titulo: "Triturar la crema", texto: "Incorpora la calabaza asada a la olla junto con el caldo y la leche de coco. Cocina 5 minutos más. Tritura con batidora de mano hasta obtener una crema muy fina. Ajusta con nuez moscada y sal." },
      { titulo: "Pipas y servir", texto: "Tuesta las pipas en sartén seca 3 minutos con una pizca de sal marina. Sirve la crema en cuencos, corona con un puñado de pipas, un hilo de AOVE y un cordón de leche de coco." }
    ],
    tags: ["vegano", "otoñal", "anti-inflamatorio"]
  }
];

// Manifiesto (simula el data/index.json)
window.RECIPES_INDEX = window.RECIPES_DATA.map(r => ({
  id: r.id,
  titulo: r.titulo,
  categoria: r.categoria,
  tiempoMin: r.tiempoMin,
  foto: r.foto,
  dificultad: r.dificultad
}));
