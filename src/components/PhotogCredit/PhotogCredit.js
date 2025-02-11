export default function PhotogCredit({ name, url }) {
  return (
    <div className="w-full flex justify-between">
      <a href={url} target="_blank">
        <span className="text-sm">captured by {name}</span>
      </a>
      <a href="https://www.pexels.com" target="_blank">
        <span className="text-sm">
          <strong>via Pexels</strong>
        </span>
      </a>
    </div>
  );
}
