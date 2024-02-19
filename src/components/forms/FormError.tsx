interface Props {
  message: string;
}

export default function FormError({ message }: Props) {
  return <p className="text-sm accent-text">{message}</p>;
}
