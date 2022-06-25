import * as THREE from 'three'

class State {
  constructor() {
    this.nodes = []
    this.links = []
    this.world_plane = null
    this.open_link = null
  }

  register_world_plane = function(plane) {
    this.world_plane = plane
  }

  register_node = function(node) {
    this.nodes.push(node)
  }

  register_open_link = function(link) {
    this.open_link = link
  }

  close_link_to_node = function (destination_node) {

    this.open_link.link_to_node(destination_node)
    this.links.push(this.open_link)
    this.open_link = null
  }

  destroy_open_link = function() {
    if ( this.is_open_link() ) {
      this.open_link.dispose()
    }
    this.open_link = null
  }

  is_open_link = function() {
    return this.get_open_link() !== null
  }

  get_open_link = function() {
    return this.open_link
  }

  get_world_plane = function() {
    return this.world_plane
  }

  get_clickable_objects() {
    //Make this memoized?
    return this.nodes.map(node => {
      return node.icon.mesh
    })
  }
}

export { State }