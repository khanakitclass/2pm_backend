const pool = require("../db/mysql")

const getSalesPeople = async() => {
    try {
        const [results, fields] = await pool.execute("SELECT * FROM salespeople");
        
        return results;
    } catch (error) {
        console.log(error);
        throw new Error("Error in fetch salespeople.")
    }
}

const addSalesPeople = async(sname, city, comm) => {
    try {
        const [results] = await pool.execute("INSERT INTO salespeople(sname, city, comm) VALUES (?, ?, ?)", [sname, city, comm]);

        return {sname, city, comm, snum: results.insertId}
    } catch (error) {
        console.log(error);
        throw new Error("Error in add salespeople.")
    }
}

module.exports = {
    getSalesPeople,
    addSalesPeople
}