import * as THREE from 'three'
class LinkPoint {
  static offset = 3
  static calculated_offsets = {}
  static calculate_offset = function (rotation) {
    if (LinkPoint.calculated_offsets[rotation] === undefined) {

      LinkPoint.calculated_offsets[rotation] = [
        (Math.cos((rotation * 60) * (Math.PI / 180)) * LinkPoint.offset),
        (Math.sin((rotation * 60) * (Math.PI / 180)) * LinkPoint.offset)
      ]

    }

    return LinkPoint.calculated_offsets[rotation]
  }

  constructor(position, scene, connection_number, parent_node) {
    this.geometry = new THREE.CircleGeometry(.5, 10);
    this.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData.parent = this
    this.parent_node = parent_node
    this.position = this.calculate_position(position, connection_number)
    this.mesh.position.set(this.position[0], this.position[1], 0)
    scene.add(this.mesh)
    this.incoming_link = null
    this.outgoing_link = null
  }

  calculate_position(parent_position, rotation) {
    return [
      parent_position[0] + LinkPoint.calculate_offset(rotation)[0],
      parent_position[1] + LinkPoint.calculate_offset(rotation)[1]
    ]
  }

  get_node_color() {
    this.parent_node.color
  }

  //Can we just cut out the middleman here?
  //This is a bad pattern -> We need to consolidate the link validity logic into
  // one place so we're not chasing it all over multiple classes & Files
  is_valid_link_to_destination(destination_link_point) {
    //are we linking to a destination that already has a registered input?
    // Does the destination node tell us we're compatible?
    return destination_link_point.is_valid_link_to_origin(this)
  }

  is_valid_link_to_origin(origin_link_point) {
    return this.incoming_link === null &&
      this.parent_node.is_linkable_to_origin(origin_link_point)
  }

  get_node_color() {
    return this.parent_node.color
  }

  register_incoming_link(incoming_link) {
    this.incoming_link = incoming_link
  }

  register_outgoing_link(outgoing_link) {
    this.outgoing_link = outgoing_link
  }

  de_register_outgoing_link() {
    this.outgoing_link = null
  }

  de_register_incoming_link() {
    this.incoming_link = null
  }

  can_create_outgoing_link() {
    return this.outgoing_link === null
  }
}


export { LinkPoint }