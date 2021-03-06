require_relative "../skeleton/lib/00_tree_node" #./skeleton/lib/00_tree_node.rb
require "byebug"
class KnightPathFinder
  
  attr_reader :considered_positions

  def self.valid_moves(pos)
    possible_moves = []
    moves = [[-1, -2], [-2, -1], [-2, 1], [-1, 2], [1, 2], [1, -2], [2, -1], [2, 1]]
    moves.each do |move|
      move_pos = [move[0] + pos[0], move[1] + pos[1]]
      #[-1, -2] [0, 0] move[0] + pos[0]       move[1] + pos[1]
      if move_pos[0] >= 0 && move_pos[0] < 8 && move_pos[1] >= 0 && move_pos[1] < 8
        #@considered_positions.push(move_pos)
        possible_moves.push(move_pos)
      end
    end
    possible_moves
  end

  def initialize(starting_pos)
    @starting_pos = starting_pos
    @root_node = PolyTreeNode.new(starting_pos)
    @board = Array.new(8) {Array.new(8,"-")}
    @considered_positions = [starting_pos]
    self.build_move_tree
    #    0 1 2 3 4 5 6 7
    #  0 
    #  1
    #  2       M   M
    #  3     M       M
    #  4         K
    #  5     M       M
    #  6       M   M
    #  7
  end

  def build_move_tree
    #call new_move_positions
    queue = [@root_node]
    # debugger
    until queue.empty?
      first = queue.shift
      new_moves = new_move_positions(first.value)
      new_moves.each do |move|
        # debugger
        new_node = PolyTreeNode.new(move)
        first.add_child(new_node)
        queue << new_node
      end
    end
    # @root_node
  end

  def new_move_positions(pos)
    new_moves = []
    possible_new_moves = KnightPathFinder.valid_moves(pos)
    possible_new_moves.each do |move|
      if !@considered_positions.include?(move)
        @considered_positions << move
        new_moves << move
      end
    end
    new_moves
    # if !@considered_positions.include?(pos)

    #   possible_moves = KnightPathFinder.valid_moves(pos)
    #   @considered_positions.push(pos)
    # end
    # @considered_positions
    #add new moves to considered positions (no duplicates)
    #return those new moves
  end

  def find_path(end_pos)
    end_node = @root_node.bfs(end_pos)
    trace_path_back(end_node)
  end

  def trace_path_back(end_node)
    arr =[end_node.value]

    current_node = end_node

    until current_node.parent.nil?
      arr.unshift(current_node.parent.value)
      current_node = current_node.parent
    end
    # arr.unshift(@root_node.value)
    arr
  end

end

# p "new game"
p new_game = KnightPathFinder.new([0,0])
# p "first move"
# p new_game.new_move_positions([1,2])
# p "considered positions: "
# p new_game.considered_positions
# p "move tree"
p "----------"
# p new_game.build_move_tree
# p new_game.considered_positions.length
p new_game.find_path([7, 6]) # => [[0, 0], [1, 2], [2, 4], [3, 6], [5, 5], [7, 6]]
p new_game.find_path([6, 2]) # => [[0, 0], [1, 2], [2, 0], [4, 1], [6, 2]]