const RestockOrder = require("../model/RestockOrder");
const PersistentManager = require("../DB/PersistentManager");
const TransportNote = require("../model/TransportNote");
const Item = require("../model/Item");
const ProductOrder = require("../model/ProductOrder");
const SKUItem = require("../model/SKUItem");
const SKU = require("../model/SKU");
const res = require("express/lib/response");
const User = require("../model/User");
const TestResult = require("../model/TestResult");

class RestockOrderManager {

	constructor() {}


	async defineRestockOrder(issue_date, productsList, supplierId) {
		//validate supplierId exists
		const suppExists = await PersistentManager.loadByMoreAttributes(
			User.tableName,
			["id", "type"],
			[supplierId, "supplier"]
		);

		
		if (suppExists.length === 0) {
			return Promise.reject("404 no supplier Id found");
		}


		let ro = new RestockOrder(null, issue_date, "ISSUED", supplierId, null);
		let newRestockOrderId = await PersistentManager.store(
			RestockOrder.tableName,
			ro
		);

		let products = [];
		for (const product of productsList) {
			let newSkuid = product.SKUId;
			// let newPrice = product.price;
			let newqty = product.qty;
			
			let exists = await PersistentManager.exists(
				SKU.tableName,
				"id",
				newSkuid
			);
			
			if (!exists) {
				
				PersistentManager.delete(
					"id",
					newRestockOrderId,
					RestockOrder.tableName
				);
				return Promise.reject("404 no sku Id found");
			}


			const existsItem = await PersistentManager.loadByMoreAttributes(
				Item.tableName,
				["SKUId", "supplierId"],
				[newSkuid, supplierId]
			);
			
			if (existsItem.length === 0) {
				
				PersistentManager.delete(
					"id",
					newRestockOrderId,
					RestockOrder.tableName
				);
				return Promise.reject("404 item");
			}

			const item = existsItem[0];

			//define a object and insert into DB

			let newProductOrder = new ProductOrder(
				null,
				newqty,
				newRestockOrderId,
				item.id
			);
			products.push(newProductOrder);
		}
		for (const product of products) {
			await PersistentManager.store(ProductOrder.tableName, product).then(
				(result) => {
					return result;
				},
				(error) => {
					return Promise.reject(
						"503 Fail to store in Product Order table"
					);
				}
			);
		}
	}

	async getAllRestockOrder() {
		let restockOrders = await PersistentManager.loadAllRows(
			RestockOrder.tableName
		);
		//evertorder need to find transportnode + 2 list(for)

		let finalRes = [];
		// let eachOrderInfo = {};
		for (const order of restockOrders) {
			let eachOrderInfo = await this.addOneOrderInfo(order);
			if(eachOrderInfo.state==="ISSUED") {
				eachOrderInfo.deliveryDate=[];
				if(eachOrderInfo.state==="DELIVERY"){
					eachOrderInfo.skuItems =[];
				}
		   }
			finalRes.push(eachOrderInfo);
		}

		return finalRes;
	}

	async getAllIssuedOrder() {
		let issueOrders = await PersistentManager.loadFilterByAttribute(
			RestockOrder.tableName,
			"state",
			"ISSUED"
		);

		if (!issueOrders) {
			return Promise.reject("404 No IssuedOrders Found");
		}

		let finalRes = [];
		// let eachOrderInfo = {};
		for (const order of issueOrders) {
			let result = await this.addOneOrderInfo(order);
			result.skuItems =[];		
			finalRes.push(result);
		}
		return finalRes;
	}

	async getRestockOrderByID(ID) {
		// let exists = await PersistentManager.exists(RestockOrder.tableName, 'id', ID);
		// if (!exists) {
		//     return Promise.reject("404 SKU");
		// }

		let ro = await PersistentManager.loadOneByAttribute(
			"id",
			RestockOrder.tableName,
			ID
		);
		if (!ro) {
			return Promise.reject("404 No RestockOrder Found");
		}

		let orderToReturn = await this.addOneOrderInfo(ro);
		delete orderToReturn.id;
		if(orderToReturn.state==="ISSUED") {
			orderToReturn.deliveryDate=[];
			if(orderToReturn.state==="DELIVERY"){
				orderToReturn.skuItems =[];
			}
	   }
		return orderToReturn;
	}

	async getItemsById(id) {
		const exists = await PersistentManager.exists(
			RestockOrder.tableName,
			"id",
			id
		);
		if (!exists) {
			return Promise.reject("404 RestockOrderid");
		}

		let ro = await PersistentManager.loadOneByAttribute('id', RestockOrder.tableName, id);
		if (ro.state !== "COMPLETEDRETURN") {
			return Promise.reject("422 completedreturn")
		}
        let allOrderInfo = await this.addOneOrderInfo(ro);	
		let allSkuItems = allOrderInfo.skuItems;
		let skuItemsToReturn = [];
		if(ro.state==="ISSUED"){
			return skuItemsToReturn;
		}
		else{
			for (const skuItemInfo of allSkuItems) {
				const testResult = await PersistentManager.loadOneByAttribute(
					"rfid",
					TestResult.tableName,
					skuItemInfo.RFID
				);
				if (testResult) {
					if (testResult.Result == false) {
						skuItemsToReturn.push(skuItemInfo);
					}
				}
			}	
			return skuItemsToReturn;
		}

	}



	/*
        {
            id: 28,
            issue_date: '2021/11/29 09:33',
            state: 'DELIVERED',
            supplier_id: 6,
            transport_note_id: 2
        }
    */
	//get all related info of ONE order
	async addOneOrderInfo(order) {
		let curOrderid = order.id;
		//gets all the rows in ProductOrder where restockOrder_id == curOrderid
		//{ id: 16, quantity: 30, restockOrder_id: 28, item_id: '1' }
		let productOrdersRows = await PersistentManager.loadFilterByAttribute(
			ProductOrder.tableName,
			"restockOrder_id",
			curOrderid
		);
		let products = [];
	
		for (const product of productOrdersRows) {
			let item = await PersistentManager.loadOneByAttribute(
				"id",
				Item.tableName,
				product.item_id
			);
			
			const skuInfo = {
				SKUId: item.SKUId,
				description: item.description,
				price: item.price,
				qty: product.quantity,
			};
			products.push(skuInfo);
		}

		let curNoteid = order.transport_note_id;
		let curtransportNode = null;
		if (curNoteid) {
			curtransportNode = await PersistentManager.loadOneByAttribute(
				"id",
				TransportNote.tableName,
				curNoteid
			);
			if (curtransportNode) {
				delete curtransportNode.id;
			}
		}

		//get list of skuitem
		let skuItemsRow = await PersistentManager.loadFilterByAttribute(
			SKUItem.tableName,
			"restockOrder_id",
			curOrderid
		);
		//use map to sort only rfid + skuid and add to skuitem in res
		let skuItems = skuItemsRow.map((item) => {
			return {
				SKUId: item.SKUId,
				RFID: item.RFID,
			};
		});

		let o;

		if (curtransportNode) {
			o = {
				id: order.id,
				issueDate: order.issue_date,
				state: order.state,
				products: products,
				supplierId: order.supplier_id,
				transportNote: curtransportNode,
				skuItems: skuItems,
			};
		} else {
			o = {
				id: order.id,
				issueDate: order.issue_date,
				state: order.state,
				products: products,
				supplierId: order.supplier_id,
				skuItems: skuItems,
			};
		}
		return o;
	}

	async modifyState(roID, newState) {
		const exists = await PersistentManager.exists(
			RestockOrder.tableName,
			"id",
			roID
		);
		if (!exists) {
			return Promise.reject("404 RestockOrderid cannot found");
		}
		return await PersistentManager.update(
			RestockOrder.tableName,
			{ state: newState },
			"id",
			roID
		);
	}

	async putSKUItems(id, newSkuitemsinfo) {
		let ro = await PersistentManager.loadOneByAttribute(
			"id",
			RestockOrder.tableName,
			id
		);
		if (!ro) {
			return Promise.reject("404 RestockOrderid not found");
		}
		if (ro.state !== "DELIVERED") {
			return Promise.reject("422 The state of order is not DELIVERED");
		}
		//update restockorde_id in SKUItem table
		for (const info of newSkuitemsinfo) {
			PersistentManager.update(
				SKUItem.tableName,
				{ restockOrder_id: id },
				"RFID",
				info.rfid
			).then(
				(result) => {
					return result;
				},
				(error) => {
					return Promise.reject(error);
				}
			);
		}
	}

	async updateTransportNote(id, newTN) {
		const exists = await PersistentManager.exists(
			RestockOrder.tableName,
			"id",
			id
		);
		if (!exists) {
			return Promise.reject("404 RestockOrderid not found");
		}

		const transportNoteId = await PersistentManager.store(
			TransportNote.tableName,
			{ deliveryDate: newTN.deliveryDate }
		);
		let restockOrderRow = await PersistentManager.loadOneByAttribute(
			"id",
			RestockOrder.tableName,
			id
		);
		
		if(restockOrderRow.state!=="DELIVERED"||restockOrderRow.issue_date > newTN.deliveryDate ){			
			return Promise.reject("422 Unprocessable Entity")
		}

		

		const updateResult = await PersistentManager.update(
			RestockOrder.tableName,
			{ transport_note_id: transportNoteId },
			"id",
			id
		);

		return updateResult;
	}

	async deleteRestockOrder(roID) {
		const exists = await PersistentManager.exists(
			RestockOrder.tableName,
			"id",
			roID
		);
		if (!exists) {
			return Promise.reject("404 RestockOrderid cannot found");
		}
		return PersistentManager.delete("id", roID, RestockOrder.tableName);
	}
}

module.exports = new RestockOrderManager();
