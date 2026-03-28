
# NavOps - Sistema de Gestión de Logística Marítima

NavOps es una plataforma integral diseñada para **digitalizar y centralizar** la planificación, el seguimiento y la ejecución de travesías marítimas. 
El sistema optimiza recursos y mejora la seguridad operativa mediante una arquitectura híbrida que garantiza el funcionamiento incluso en entornos con conectividad limitada.

---

## Propuesta de Valor
* **Eficiencia Operativa:** Reducción de costos mediante una planificación centralizada.
* **Seguridad:** Gestión de riesgos en tiempo real y control estricto de carga/descarga.
* **Resiliencia:** Capacidad de trabajo offline mediante almacenamiento local para tripulación a bordo.

---

## Perfiles de Usuario
El sistema está adaptado a las necesidades específicas de cada rol:
* **Administrador / Jefe de Navegación (Desktop):** Dashboard estratégico con indicadores de rendimiento (KPIs) y control global de travesías.
* **Jefe de Operaciones (Tablet/PWA):** Gestión ágil de *Check-In* y *Check-Out* de contenedores a pie de muelle o en bodega.
* **Tripulación (PWA/Offline):** Acceso al plan de navegación y registro de eventos durante la travesía.

---

## Stack Tecnológico

### Backend
* **Lenguaje:** Java 21
* **Framework:** Spring Boot 4.x
* **Gestor de Dependencias:** Maven
* **Base de Datos:** PostgreSQL (Cloud/Production)

### Frontend
* **Framework:** React + Vite
* **Estilos:** Tailwind CSS
* **Persistencia Local:** IndexedDB (para soporte Offline-First)

### Infraestructura & DevOps
* **Contenedores:** Docker & Docker Compose
* **Despliegue:** Render
* **Control de Versiones:** Git (GitHub)

---

## Funcionalidades Principales
1.  **Planificación de Travesías:** Registro y gestión técnica de rutas y horarios.
2.  **Gestión de Carga:** Control digitalizado de carga y descarga de contenedores.
3.  **Monitoreo en Tiempo Real:** Sistema de geolocalización para seguimiento de flota.
4.  **Panel de Estadísticas:** Visualización de datos críticos para la toma de decisiones.

---

## Instalación y Configuración

### Requisitos Previos
* **JDK 21** instalado.
* **Maven** configurado.
* **Node.js** (versión LTS recomendada).
* **Docker** y Docker Compose.

### Pasos para replicar el entorno:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/MaximilianoEcheverria91/NavOps.git](https://github.com/MaximilianoEcheverria91/NavOps.git)
   cd NavOps

## Equipo de Desarrollo
Este proyecto es posible gracias al trabajo de:

* **[Maximiliano Damian Echeverria]** ([@MaximilianoEcheverria91](https://github.com/MaximilianoEcheverria91)) - *Backend & DevOps*
* **[Virginia Penialoza]** ([@Virginia671](https://github.com/Virginia671)) - *Frontend & PWA*
* **[Marilina L. Alonso]** ([@UsuarioGitHub3](https://github.com/UsuarioGitHub3)) - *Database & UI/UX*
* **[Santiago Bustos]** ([@UsuarioGitHub4](https://github.com/UsuarioGitHub4)) - *Testing & Documentation*
