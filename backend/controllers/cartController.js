const{addToCartModel, getCartItemsModel, deleteCartItemModel, updateCartItemModel,checkCartItemExists} = require('../models/cartModel');

const addToCart = async (req, res) =>{
    const { customer_id, product_id, quantity,total } = req.body;

    
    
    try {
        // Check if the item already exists in the cart
        const existingItem = await checkCartItemExists(customer_id, product_id, quantity);
        // If exists, return a conflict response
        

        if (existingItem) {
            return res.status(409).json({ message: 'Item already exists in cart', item: existingItem });
        }

        // If not exists, proceed to add
        const cartItem = await addToCartModel(customer_id, product_id, quantity, total);
        res.status(201).json(cartItem);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getCartItems = async (req, res) => {
    const { customer_id } = req.params;

    try {
        const cartItems = await getCartItemsModel(customer_id);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteCartItem = async (req, res) => {
    const cartItem_id = req.params.id;

    try {
        const result = await deleteCartItemModel(cartItem_id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cart item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const updateCartItem = async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from the token
    const cartItemId = req.params.id; // Assuming you pass the cart item ID in the URL
    const { quantity } = req.body; // Assuming you pass the new quantity in the request body

    try {
        const result = await updateCartItemModel(userId, cartItemId, quantity);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cart item updated successfully' });
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { addToCart, getCartItems, deleteCartItem, updateCartItem };