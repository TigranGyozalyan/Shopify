
const shopElements = {
	shopContainer: '.shop__container',
	shopTitle: '.shop__title',
	shopElement: '.shop__element',
	deleteButton: '.button__delete',
	addButton: '.button__add',
	nameInput: '.shop__name'
}


const container = document.querySelector(shopElements.shopContainer);




//State of the application
/*
|List of shops
*/

const state = {};


const renderShop = shop => {
	const markup = 
	`
		<div class="shop__element" id=${shop.id}>
			<input class="shop__name" placeholder="Enter the Shop Name..." value="${shop.name ? shop.name : ""}" spellcheck="false">
			<a href="page2.html?shopId=${shop.id}" class="button button__edit">Edit</a>
			<button class="button button__delete">Delete</button>
		</div>
	`;
	const button = document.querySelector(shopElements.addButton);
	button.insertAdjacentHTML('beforebegin', markup);
}

const deleteShop = (id) => {
	const element = document.querySelector(`[id="${id}"]`);
	element.parentElement.removeChild(element);
}



const deleteShopFromLocalStorage = shop => {
	window.localStorage.removeItem(`ShopId=${shop.id}`);
}


const addNameEvents = (domElement, id) => {
	
	const index = state.shops.findIndex(el => el.id === id);
	const shop = state.shops[index];
	
	domElement.addEventListener('change', e => {
	// console.log('I was changed');
	shop.name = e.target.value;
	
	//Update local storage
	addShopToLocalStorage(shop);
	
	});

	//Update name on enter key press
	domElement.addEventListener('keydown', e => {
		if(e.keyCode === 13) {
			this.blur();
		}
	})
}



//Handle clicks on shop elements
container.addEventListener('click' , e => {

	//Handle deleting a shop
	if(e.target.matches(shopElements.deleteButton,`${shopElements.deleteButton} *`)) {
		
		//Get the id of the target shop
		const id = parseInt(e.target.closest(shopElements.shopElement).id);
		
		
		const index = state.shops.findIndex(el => el.id === id);

		//Delete the shop from local storage
		
		deleteShopFromLocalStorage(state.shops[index]);
		
		//Delete the shop from the state
		
		state.shops.splice(index , 1);


		//Delete the shop from the UI
		deleteShop(id);
	}
	
	//Handle adding a shop
	
	if(e.target.matches(shopElements.addButton, `${shopElements.addButton} *`)) {
		if(!state.shops) state.shops = [];
		

		let lastId;
		if(state.shops.length != 0) {
			lastId = state.shops[state.shops.length - 1].id + 1;
		} else {
			lastId = 0;
		}
		
		//Add the shop to the state
		const shop = new Shop(lastId);
		state.shops.push(shop);

		//Add the shop to local storage
		addShopToLocalStorage(shop);

		//Add the newly created shop to the UI
		renderShop(shop);

		//Add event listeners to handle name editing on change
		const shopInput = document.getElementById(shop.id).querySelector(shopElements.nameInput);
		addNameEvents(shopInput, shop.id);
		//Update name on input value update
	}

});

//Retrieve existing shops from local storage

window.addEventListener('load', e => {
	// state.shops = JSON.parse(window.localStorage.getItem('shops')).map(el => {
		// return new Shop(el.id, el.name);
	// });
	state.shops = [];
	
	//Iterate over items in local storage
	for(let i = 0; i < localStorage.length; i++) {
		//Check whether the value is a shop
		if (window.localStorage.key(i).includes('ShopId=')) {
			//Add the shop to the state
			const obj = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)));
			const shop = new Shop(obj.id, obj.name);
			state.shops.push(shop);
		}
	}

	//Sort the elements in order they were added
	state.shops.sort((a , b) => a.id - b.id );
	state.shops.forEach(el => {

		//Render shop UI
		renderShop(el);

		//Attach events
		const shopInput = document.getElementById(el.id).querySelector(shopElements.nameInput);
		addNameEvents(shopInput, el.id);
		
	})
});
