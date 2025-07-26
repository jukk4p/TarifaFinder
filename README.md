# TarifaFinder 💡

**Encuentra la mejor tarifa de luz para ti con el poder de la Inteligencia Artificial.**

TarifaFinder es una aplicación web de código abierto construida con Next.js y Genkit que te ayuda a comparar tarifas eléctricas en España para encontrar la opción más económica según tus hábitos de consumo.

## ✨ Características Principales

*   **Comparador de Tarifas Avanzado**: Introduce tus datos de consumo y obtén una comparativa precisa entre las principales tarifas del mercado.
*   **Extracción de Datos con IA**: Sube una foto o PDF de tu factura y nuestra IA extraerá los datos de consumo automáticamente.
*   **Análisis Personalizado con IA**: Recibe una explicación detallada y consejos de ahorro generados por IA basados en tu perfil de consumo.
*   **Visualización de Datos**: Un gráfico interactivo te muestra cómo se distribuye tu consumo energético.
*   **Soporte Multilingüe**: Disponible en Español, Inglés y Catalán.
*   **Diseño Moderno y Responsivo**: Una interfaz limpia y fácil de usar, construida con Tailwind CSS y Shadcn UI.

## 🚀 Tecnologías Utilizadas

*   **Framework**: [Next.js](https://nextjs.org/) (con App Router)
*   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
*   **Inteligencia Artificial**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes UI**: [Shadcn UI](https://ui.shadcn.com/)
*   **Formularios**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Gráficos**: [Recharts](https://recharts.org/)
*   **Backend Services**: [Firebase](https://firebase.google.com/) (Analytics & Performance)

## 🛠️ Cómo Empezar

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos

*   Node.js (v18 o superior)
*   npm o pnpm

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tarifafinder.git
    cd tarifafinder
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu API Key de Google AI Studio (Gemini):
    ```env
    GEMINI_API_KEY="TU_API_KEY_AQUI"
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📜 Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo de Next.js.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run start`: Inicia el servidor de producción.
*   `npm run lint`: Ejecuta el linter de Next.js para revisar el código.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas para mejorar la aplicación, por favor abre un *issue* para discutirlo o envía directamente un *pull request*.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
