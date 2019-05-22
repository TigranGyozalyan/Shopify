const productElements = {
	container: '.shop__container',
	shopNameId: 'shopName',
	productName: '.table__name__input',
	productQty: '.table__qty__input',
	productPrice: '.table__price__input',
	productEdit: '.fa-pen',
	productRow: '.product__row',
	productDelete: '.fa-trash',
	finalRowId: 'finalRow',
	headerId: 'headerRow',
	tableId : 'table',
	addButton: '.button__add',
	finalPriceId: 'final__price'
}

const container = document.querySelector(productElements.container);
let shop;
const state = {};


const renderPrice = () => {

	if(state.products.length) {
		let price = 0;
		state.products.forEach(el => {
			price += el.calculateTotalPrice();
		});
		document.getElementById(productElements.finalPriceId).innerHTML = `$${price}`;
	}

}

const addProductEvents =  id => {

	//Find the product
	const index = state.products.findIndex(el => el.id === id);
	const product = state.products[index];

	const domElement = document.getElementById(id);
	const name = domElement.querySelector(productElements.productName);
	const qty = domElement.querySelector(productElements.productQty);
	const price = domElement.querySelector(productElements.productPrice);

	name.addEventListener('blur', e => {
		product.name = e.target.value;
		addShopToLocalStorage(shop);
		e.target.setAttribute('disabled',true);
	}, true);

	name.addEventListener('keydown', e => {
		if(e.keyCode === 13) {
			this.blur();
		}
	});

	qty.addEventListener('blur', e => {
		product.qty = parseInt(e.target.value);
		addShopToLocalStorage(shop);
		e.target.setAttribute('disabled',true);
		//Update total price
		renderPrice();

	}, true);

	price.addEventListener('blur', e => {
		product.price = parseInt(e.target.value);
		addShopToLocalStorage(shop);
		e.target.setAttribute('disabled',true);
		//Update total price
		renderPrice();
	}, true);
}









window.addEventListener('load', e => {
	const shopId = window.location.search.split('=')[1];
	const obj = JSON.parse(window.localStorage.getItem(`ShopId=${shopId}`));
	shop = new Shop(obj.id,obj.name);
	shop.products = obj.products.map(el => new Product(el.id, el.name, el.qty, el.price));
	const shopName = document.getElementById(productElements.shopNameId);
	shopName.innerHTML = shop.name;


	//Load products for the shop
		if(shop.products.length) {

			//Render the table
			renderTable();

			//Add products to the state
			state.products = shop.products.map( el => el);

			//Render each product
			state.products.forEach(el => {
				renderProduct(el);

				//Attach events
				addProductEvents(el.id);
			});

			//Update total price
			renderPrice();
		 
		}

})



const renderTable = () => {
	const markup = 
	`
	<table id="table">
		<tr id="headers">
			<th class="table__name">Name</th>
			<th class="table__qty">QTY</th>
			<th class="table__price">Price</th>
		</tr>

		<tr id="finalRow">
			<td class="table__name"></td>
			<td class="table__qty"></td>
			<td class="table__price"><span id="total">Total Price <br/><span id="final__price">$0</span></span></td>
		</tr>
	</table>		
	`;

	const button = document.querySelector(productElements.addButton);
	button.insertAdjacentHTML('beforebegin', markup);
}

const deleteTable = () => {
	const element = document.getElementById(productElements.tableId);
	element.parentElement.removeChild(element);
} 

const renderProduct = product => {
	
	const markup = 
	`
	<tr class="product__row" id="${product.id}">
		<td class="table__name"><input class="table__name__input" placeholder="Enter the Product Name..." value="${product.name ? product.name : ""}"></td>
		<td class="table__qty"><input class="table__qty__input" type="number" value="${product.qty ? product.qty : 0}" min="0"></td>
		<td class="table__price">$<input class="table__price__input" type="number" value="${product.price ? product.price : 0}" min="0">
			<i class="fa fa-pen"></i>
			<i class="fa fa-trash w3-tiny"></i>
		</td>
	</tr>
	`;
	const finalRow = document.getElementById(productElements.finalRowId);
	finalRow.insertAdjacentHTML('beforebegin', markup);
}

const deleteProduct = id => {
	const element = document.querySelector(`[id="${id}"]`);
	element.parentElement.removeChild(element);
}


container.addEventListener('click', e => {
	

	if(e.target.matches(productElements.productDelete,`${productElements.productDelete} *`)) {
		
		//Find id of the product
		const id = parseInt(e.target.closest(productElements.productRow).id);
		
		//Delete product from the state
		const index = state.products.findIndex(el => el.id === id);
		state.products.splice(index , 1);
		
		//Delete product from shop and update local storage
		shop.deleteProduct(id);
		addShopToLocalStorage(shop);
		
		//Delete product from UI
		deleteProduct(id);
		if(!state.products.length) {
			deleteTable();
		}
	}

	if(e.target.matches(productElements.addButton,`${productElements.addButton} *`)) {

		if(!state.products) state.products = [];

		let lastId;

		if(state.products.length != 0) {
			lastId = state.products[state.products.length - 1].id + 1;
		} else {
			lastId = 0;
		}

		//Chech whether there are products remaining
		if(!state.products.length) {
			renderTable();
		}

		//Add the product to the state
		const product = new Product(lastId);

		state.products.push(product);

		//Add the product to the shop 
		shop.addProduct(product);
		
		//Update local storage
		addShopToLocalStorage(shop);

		renderProduct(product);

		//Attach events
		addProductEvents(product.id);		
	}

	if(e.target.matches(productElements.productEdit,`${productElements.productEdit} *`)) {
		//Find id of the product
		const id = parseInt(e.target.closest(productElements.productRow).id);

		const domElement = document.getElementById(id);
		const name = domElement.querySelector(productElements.productName);
		const qty = domElement.querySelector(productElements.productQty);
		const price = domElement.querySelector(productElements.productPrice);

		name.removeAttribute('disabled');
		qty.removeAttribute('disabled');
		price.removeAttribute('disabled');

	}

})

