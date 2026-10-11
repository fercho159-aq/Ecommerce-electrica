"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

/** Imagen de producto; si no hay o no carga, muestra el ícono genérico. */
export default function ProductImage({ src, alt, className, fallbackClassName }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <Zap className={fallbackClassName} />;
  }
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />;
}
