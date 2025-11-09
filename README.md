# 🎄 Fluffy Advent Calendar

A festive interactive React component built with Next.js featuring 24 advent calendar doors with 3D flip animations and warm holiday styling.

## ✨ Features

- **24 Interactive Doors**: Each day (1-24) has its own clickable door
- **3D Flip Animation**: Smooth rotateY animation when doors are clicked
- **Responsive Grid**: Doors have random sizes and adapt to different screen sizes
- **Festive Styling**: Deep reds, golds, and warm gradients with glowing effects
- **Persistent State**: Uses localStorage to remember which doors you've opened
- **Image Support**: Displays images from `/public/images/advent/day-[n].jpg`
- **Custom Prompts**: Two arrays of prompts (early and late tasks) with special handling
- **Christmas Day Special**: Day 24 has a fixed festive message

## 🚀 Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the advent calendar.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Tailwind CSS imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page rendering FluffyAdventCalendar
├── components/
│   └── FluffyAdventCalendar.tsx  # Main advent calendar component
├── public/
│   └── images/
│       └── advent/          # Place day-1.jpg through day-24.jpg here
└── ...config files
```

## 🎨 Customization

### Adding Your Images

Place 24 images in `/public/images/advent/` named:
- `day-1.jpg`
- `day-2.jpg`
- ...
- `day-24.jpg`

If images are missing, the component shows festive emoji fallbacks.

### Customizing Prompts

Edit the arrays in `components/FluffyAdventCalendar.tsx`:

```typescript
const earlyTasks = [
  "Your custom prompt 1",
  "Your custom prompt 2",
  // ... add your prompts
];

const lateTasks = [
  "Your custom prompt for later days",
  "If You Had Me There Tonight - this appears in days 20-23",
  // ... add your prompts
];
```

### Styling

The component uses Tailwind CSS with custom Christmas colors and animations defined in `tailwind.config.js`.

## 🎯 Special Features

- **Smart Prompt Distribution**: Early tasks (days 1-19), late tasks (days 20-23), special Christmas message (day 24)
- **Steamy Content Placement**: The "If You Had Me There Tonight" prompt only appears in days 20-23
- **Grid Variety**: Random grid spans create visual interest
- **Loading State**: Shows loading message while initializing
- **Error Handling**: Graceful fallbacks for missing images

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management

## 📝 License

This project is for personal use. Feel free to customize and enjoy your festive advent calendar!

---

Happy Holidays! 🎄✨
