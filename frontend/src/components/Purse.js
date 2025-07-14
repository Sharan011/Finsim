export default function Purse({ amount, anim }) {
  return (
    <div className={`purse ${anim}`}>
      💰 ${amount}
      {anim === "credit" && <span className="money-anim plus">+${amount}</span>}
      {anim === "debit" && <span className="money-anim minus">-${amount}</span>}
    </div>
  );
}
