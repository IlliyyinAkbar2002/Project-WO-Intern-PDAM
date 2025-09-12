import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen ">
      <Image
        src="/images/bg-wave.svg"
        alt="Background"
        fill
        priority
        className="object-contain object-bottom -z-10 opacity-30"
      />
      <div className="w-1/2 hidden lg:flex justify-center">
        <Image
          src="/images/airo-berlari.svg"
          alt="PDAM Surya Sembada"
          width={200}
          height={200}
          className="lg:w-[200px] xl:w-[300px] 2xl:w-[400px]"
        />
      </div>
      {children}
    </div>
  );
}
