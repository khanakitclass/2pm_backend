const { Salespeople } = require("../model")

const listSalesPeople = async (req, res) => {
    try {
        const salespeople = await Salespeople.getSalesPeople();

        res.status(200).json({
            success: true,
            data: salespeople,
            message: "Salespeople data fetched."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}

const addSalesPeople = async (req, res) => {
    try {
        const { sname, city, comm } = req.body;

        const salespeople = await Salespeople.addSalesPeople(sname, city, comm);

        console.log(salespeople);

        res.status(201).json({
            success: true,
            data: salespeople,
            message: "Salespeople data created."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}

module.exports = {
    listSalesPeople,
    addSalesPeople
}