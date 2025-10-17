# 📊 Test Tag Editor - Interactive Dashboard

Una aplicación React + TypeScript con Vite para edición interactiva de tags en imágenes y dashboard analítico avanzado.

## ✨ Nuevas Funcionalidades del Dashboard

### 🎯 Dashboard Interactivo Multi-Curva
- **3 curvas completamente editables** con 100 puntos cada una
- **Interpolación Gaussiana automática** para transiciones suaves
- **Estadísticas en tiempo real** (promedio, máximo, mínimo)
- **Arrastrar y soltar** puntos para editar curvas en tiempo real
- **Exportación a PNG** del dashboard completo

### 🔧 Características Técnicas
- **Algoritmo Gaussiano**: Smoothing automático de curvas vecinas
- **Radio de influencia**: 8 puntos para transiciones naturales
- **Datos mockeados**: 300 puntos totales (3 × 100)
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🚀 Cómo Usar

### Ejecutar la Aplicación
```bash
# Desarrollo
./run.sh dev

# Build producción
./run.sh build

# Instalar dependencias
./run.sh install

# Limpiar proyecto
./run.sh clean
```

### Navegación
1. **Editor** (`/`) - Edición de tags en imágenes con Konva.js
2. **Dashboard** (`/dashboard`) - Curvas interactivas y análisis
3. **Report** (`/report`) - Vista de reporte con exportación PDF

### Dashboard Interactivo
1. Navega a la sección Dashboard
2. Haz clic en cualquier punto de las curvas
3. Arrastra para modificar el valor
4. Observa cómo la interpolación Gaussiana suaviza automáticamente
5. Ve las estadísticas actualizarse en tiempo real
6. Exporta como PNG o resetea las curvas

## 🛠️ Stack Tecnológico

- **React 18.2.0** + **TypeScript** + **Vite 6.4.0**
- **Konva.js** + **react-konva** para canvas 2D
- **Zustand 5.0.8** para gestión de estado
- **Recharts 3.2.1** para visualizaciones interactivas
- **jsPDF** + **html2canvas** para exportación PDF
- **React Router DOM** para navegación SPA

## 📈 Algoritmo de Interpolación Gaussiana

```typescript
const gaussianKernel = (distance: number, sigma: number = 2.5): number => {
  return Math.exp(-(distance * distance) / (2 * sigma * sigma))
}

const applyGaussianSmoothing = (data: number[], changedIndex: number, newValue: number, radius: number = 8): number[] => {
  // Aplicar suavizado gaussiano a puntos vecinos
  // Radio de 8 puntos para transiciones naturales
  // Peso gaussiano decreciente con la distancia
}
```

## 🎨 Características Visuales

- **3 Curvas Coloreadas**:
  - 💰 Revenue (Azul - #8884d8)
  - 💸 Expenses (Verde - #82ca9d) 
  - 📈 Profit (Amarillo - #ffc658)

- **Interfaz Moderna**:
  - Puntos arrastrables con sombras
  - Tooltips informativos
  - Estadísticas en tiempo real
  - Botones estilizados con iconos
  - Layout responsive

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Charts/
│   │   ├── InteractiveMultiCurveChart.tsx  # 🆕 Dashboard interactivo
│   │   ├── LineChartCard.tsx
│   │   └── PieChartCard.tsx
│   ├── EditorCanvas/                       # Sistema de canvas Konva
│   └── Export/                            # Exportación PDF/PNG
├── routes/
│   ├── DashboardPage.tsx                   # 🆕 Dashboard mejorado
│   ├── EditorPage.tsx
│   └── ReportPage.tsx
└── lib/
    └── format.ts                          # Utilidades
```

## 🧪 Testing

```bash
./run.sh test
```

Los tests están en `src/tests/` con extensión `.spec.tsx`.

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**🎯 Funcionalidad Principal**: Dashboard interactivo con curvas editables y interpolación gaussiana automática para análisis de datos en tiempo real.