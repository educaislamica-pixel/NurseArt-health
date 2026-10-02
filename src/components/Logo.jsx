/** Logo oficial (incluye el nombre). El PNG trae su propio fondo azul, por eso va en una pastilla redondeada. */
export default function Logo({ height = 44 }) {
  return <img src="/logo-nurseart.png" alt="NurseArt" style={{ height }} className="w-auto rounded-xl" />;
}
