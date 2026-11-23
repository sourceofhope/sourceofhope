import { Inter, Urbanist } from "next/font/google";

// Variable fonts (one file each). Every root layout puts `fontVariables` on
// <html> so the theme tokens in globals.css can read --nf-inter/--nf-urbanist.
const inter = Inter({ variable: "--nf-inter", subsets: ["latin"], display: "swap" });
const urbanist = Urbanist({ variable: "--nf-urbanist", subsets: ["latin"], display: "swap" });

export const fontVariables = `${inter.variable} ${urbanist.variable}`;
