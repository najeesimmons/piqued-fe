# 📸 Next.js Photo Gallery

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Supabase-Fullstack-green?style=for-the-badge&logo=supabase" />
</p>

A modern, full-stack **photo gallery** built with **Next.js** — featuring infinite scrolling, image favoriting, modal previews, and a comment system backed by **Supabase**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

- 🔄 **Infinite Scroll** — Browse photos without reloads.
- ❤️ **Favorites** — Save images you love.
- 💬 **Comments** — Discuss any image.
- 📱 **Responsive UI** — Works on mobile, tablet, and desktop.
- 🖼 **Modal Previews** — View full-size images instantly.

---

## 🛠 Tech Stack

| Layer        | Technology                                                               |
| ------------ | ------------------------------------------------------------------------ |
| **Frontend** | [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend**  | [Supabase](https://supabase.com/)                                        |
| **Images**   | [Pexels API](https://www.pexels.com/api/)                                |
| **State**    | React hooks, custom hooks                                                |
| **Deploy**   | [Vercel](https://vercel.com/)                                            |

---

## 📂 Project Structure

src/
components/ # UI components (Gallery, PhotoCard, etc.)
hooks/ # Custom React hooks
lib/ # API utilities, Supabase client
pages/ # Next.js pages
styles/ # Tailwind styles

---

## ⚙️ Getting Started

<details>
<summary><strong>1️⃣ Clone the Repository</strong></summary>

```bash
git clone https://github.com/yourusername/nextjs-photo-gallery.git
cd nextjs-photo-gallery
```

</details>

<details>
<summary><strong>2️⃣ Install Dependencies</strong></summary>

```bash
npm install
```

</details>

<details>
<summary><strong>3️⃣ Set Environment Variables</strong></summary>

```bash
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

</details>

<details>
<summary><strong>4️⃣ Run the Development Server</strong></summary>

```bash
npm run dev
```

Visit http://localhost:3000.

## </details>

## 🌐 Deployment

This project is **Vercel-ready**:

```bash
vercel
```

---

## 📸 Screenshots

## 📜 License

MIT License — feel free to fork and modify.
