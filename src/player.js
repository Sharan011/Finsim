class Player {
  constructor() {
    this.balance = 1000;
    this.savings = 0;
    this.month = 1;
    this.income = 500;
  }
  save() {
    let amount = 100;
    if (this.balance >= amount) {
      this.savings += amount;
      this.balance -= amount;
      console.log(`Saved $${amount}.`);
    } else {
      console.log("Not enough balance to save.");
    }
  }
  expense() {
    let expense = 200;
    this.balance -= expense;
    console.log(`Spent $${expense}.`);
  }
  nextMonth() {
    this.balance += this.income;
    this.month++;
  }
}
module.exports = { Player };
