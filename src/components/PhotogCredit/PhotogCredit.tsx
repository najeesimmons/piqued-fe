interface PhotogCreditProps {
  name: string;
  pexelPhotogPageUrl: string;
  pexelShowPageUrl: string;
}

export default function PhotogCredit({
  name,
  pexelPhotogPageUrl,
  pexelShowPageUrl,
}: PhotogCreditProps) {
  return (
    <div className="w-full ">
      <span className="text-sm">
        Photo by{" "}
        <a
          href={pexelPhotogPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {name}
        </a>{" "}
        on
        <a
          href={pexelShowPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {" "}
          Pexels
        </a>
      </span>
    </div>
  );
}
