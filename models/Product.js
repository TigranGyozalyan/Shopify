class Product {
	constructor(id, name = "" , qty = 0, price = 0) {
		this.id = id;
		this.name = name;
		this.qty = qty;
		this.price = price;
	}
	calculateTotalPrice() {
		return this.price * this.qty;
	}
}