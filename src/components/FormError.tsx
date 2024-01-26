interface Props {
  message: string;
}

export default function FormError({ message }: Props) {
  return <p className="text-sm text-red-500">{message}</p>;
}
