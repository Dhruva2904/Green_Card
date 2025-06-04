import User from "../models/User.js"

// Update User CardData : /api/card/update

export const updateCard = async (req, res)=>{
    try {
        const { userId, cardItems } = req.body
        await User.findByIdAndUpdate(userId, {cardItems})
        res.json({success: true, message: "Card Updated"})

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}