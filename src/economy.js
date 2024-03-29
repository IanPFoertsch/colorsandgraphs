import { Node } from "./node"

class GlobalSupply {
  constructor() {
    this.color_supply = {}
    Object.values(Node.COLORS).forEach(color => {
      this.color_supply[color] = 0
    })
  }

  increase_supply_for_color(color, amount_supplied) {
    this.color_supply[color] += amount_supplied
  }

  get_supply_for_color(color) {
    return this.color_supply[color]
  }
}

class GlobalDemand {
  constructor() {
    this.color_demand = {}
    Object.values(Node.COLORS).forEach(color => {
      this.color_demand[color] = 0
    })
  }

  increase_demand_for_color(color, amount_supplied) {
    this.color_demand[color] += amount_supplied
  }

  get_demand_for_color(color) {
    return this.color_demand[color]
  }
}

class Economy {
  //The economy is the public interface here, everything except the global supply update
  //should be private
  static NODE_CREATION_THRESHOLD = 10
  static NODE_DESTRUCTION_THRESHOLD = 30

  constructor() {
    this.global_supply = new GlobalSupply()
    this.global_demand = new GlobalDemand()
  }

  get_links = function() {
    return window.state.get_graph().get_links()
  }

  get_nodes = function() {

    return window.state.get_graph().get_nodes()
  }

  //This is the global demand curve function
  get_price_for_color(color) {

    // y = -x + intercept
    // ------------------------
    // y = price
    // x = _globally_ supplied quantity
    // intercept => A determinant of the height of the demand curve
    // -- Higher intercept = market demands more of this color,
    // -- Lower intercept = market demands less of this color
    var supply = this.global_supply.get_supply_for_color(color)
    var demand = this.global_demand.get_demand_for_color(color)

    return ( - supply ) + demand
  }

  //Update the economy's supply and demand from the current state of the board
  update() {
    //Update supply
    var current_supply = new GlobalSupply()


    this.get_links().forEach(link => {
      current_supply.increase_supply_for_color(
        link.get_color_supplied(),
        link.get_quantity_supplied()
      )
    })
    this.global_supply = current_supply

    //Update demand
    var current_demand = new GlobalDemand()
    this.get_nodes().forEach(node => {
      node.demands_by_color().forEach(color_demanded => {
        current_demand.increase_demand_for_color(color_demanded, 10)
      })
    })

    this.global_demand = current_demand
  }

  //based on the current prices, if prices are low, create new nodes demanding that color
  // if prices are high, destroy unsupplied nodes demanding that color
  get_node_creation() {
    var colors_to_create = []
    Object.keys(Node.COLORS).forEach((color) => {
      var price = this.get_price_for_color(color)

      if (price < Economy.NODE_CREATION_THRESHOLD) {
        colors_to_create.push(color)
      }
    })

    //Notify a pubsub queue of demand for new nodes?
    return colors_to_create
  }

  get_node_deletion() {
    var colors_to_delete = []

    Object.keys(Node.COLORS).forEach((color) => {
      var price = this.get_price_for_color(color)

      if (price > Economy.NODE_DESTRUCTION_THRESHOLD) {
        colors_to_delete.push(color)
      }
    })

    //Notify a pubsub queue of orders to destroy nodes?
    return colors_to_delete
  }
}

export { Economy, GlobalSupply }