import { UILink } from '../ui_objects/ui_link'

class Link {
  constructor() {
    this.rendered = false
    this.ui_representation = new UILink()
    this.origin_link_point = null
    this.destination_link_point = null
  }

  get_quantity_supplied() {
    //TODO: Make these values derived from the market
    return 10
  }

  get_color_supplied() {
    return this.origin_link_point.get_node_color()
  }

  get_link_value() {
    //We should find a better way of accessing global entities than
    // storing it on the state. This causes a tight linkage between a node
    // link and a completely different entity
    return window.state.economy.get_price_for_color(this.origin_link_point.get_node_color()) *
      this.get_quantity_supplied()
  }

  add_label() {
    this.ui_representation.add_label(
      this.get_link_value()
    )
  }

  is_valid_link(destination_link_point) {
    return this.origin_link_point.is_valid_link_to_destination(destination_link_point)
  }

  is_closed_link() {
    return this.destination_link_point !== null
  }

  get_origin_node() {
    if (this.origin_link_point) {
      return this.origin_link_point.get_parent_node()
    }
    return null
  }

  get_destination_node() {
    if (this.destination_link_point) {
      return this.destination_link_point.get_parent_node()
    }
    return null

  }

  set_origin(origin_link_point) {
    this.origin_link_point = origin_link_point
    this.origin_link_point.register_outgoing_link(this)

    this.update_render()
  }

  link_to_link_point(destination_link_point) {
    this.destination_link_point = destination_link_point
    destination_link_point.register_incoming_link(this)
    this.add_label()
    this.update_render()
  }

  draw_to_point(x, y) {
    this.ui_representation.draw_to_point(x, y)
  }

  update_render() {
    this.ui_representation.set_origin(
      this.origin_link_point.position[0],
      this.origin_link_point.position[1]
    )

    if (this.destination_link_point !== null) {
      this.draw_to_point(
        this.destination_link_point.position[0],
        this.destination_link_point.position[1]
      )
    }
  }

  dispose() {
    this.origin_link_point.de_register_outgoing_link()
    if (this.destination_link_point !== null) {
      this.destination_link_point.de_register_incoming_link()
    }
    this.ui_representation.dispose()
  }
}

export { Link }