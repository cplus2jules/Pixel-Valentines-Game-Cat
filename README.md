# For My Babi <3

I made this little game for mi babi and Happy Valentine's Day!

![Happy Valentines Day](./public/cat-love.gif)

## How to Set It Up

If you want to run this yourself or make changes, here is how you do it:

1.  **Install Node.js**: Make sure you have Node.js installed on your computer.
2.  **Open Terminal**: Open your terminal and navigate to the project folder.
3.  **Install Dependencies**: Run the following command:
    ```bash
    npm install
    # or if you use pnpm
    pnpm install
    ```
4.  **Start the Game**: Run this command to start the game locally:
    ```bash
    npm run dev
    # or
    pnpm run dev
    ```
5.  **Play**: Open `http://localhost:3000` (or whatever link it shows) in your browser!

## How to Deploy (Netlify)

Want to put it online so you can play it anywhere?

1.  **Push to GitHub**: Make sure your code is pushed to a GitHub repository.
2.  **Go to Netlify**: Log in to [Netlify](https://www.netlify.com/).
3.  **Add New Site**: Click "Add new site" -> "Import from existing project".
4.  **Connect GitHub**: specialized to your GitHub account and select this repository.
5.  **Configure Build**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  **Environment Variables**:
    *   Go to **Site settings** > **Build & deploy** > **Environment variables**.
7.  **Deploy**: Click "Deploy site" and wait for the magic!

## Adding More Love

If you want to change the messages from Jules, go to `constants.ts` and update the `JULES_MESSAGES` list. Remember to end them with "babi"!

---

**Made with <3 by your jules**
