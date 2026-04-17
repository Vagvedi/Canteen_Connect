export default function OrderStatusBadge({ status }) {
  return <span className={`badge-neu ${status}`}>{status}</span>;
}
