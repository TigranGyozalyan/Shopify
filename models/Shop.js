class Shop {
	constructor(id, name = ``) {
		this.name = name;
		this.products = [];
		this.id = id;
	}

	addProduct(product) {
		this.products.push(product);
	}

	deleteProduct(id) {
		const index = this.products.findIndex(el => el.id === id);
		this.products.splice(index, 1);
	}
}


const addShopToLocalStorage = shop => {
	window.localStorage.setItem(`ShopId=${shop.id}`, JSON.stringify(shop));	
}