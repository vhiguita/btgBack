const User = require ('../../src/models/Users');
const Transaction = require ('../../src/models/Transaction');

const leaveFund = async (req, res) => {
    try {
        const { userId, fundId } = req.body;

    // 1️ Buscar la transacción de apertura
    const existingTransaction = await Transaction.findOne({
        user: userId,
        fund: fundId,
        type: "apertura"
      });
      
      if (!existingTransaction) {
        return res.status(400).json({ message: "El usuario no está en este fondo." });
      }

    let enabledSus = await Transaction.find({
      user: userId,
      fund: fundId,
      type: "apertura"
    });

    const numEnabledSus = enabledSus.length;
  

    let canceledSus = await Transaction.find({
      user: userId,
      fund: fundId,
      type: "cancelación"
    });

    const numCanceledSus =  canceledSus.length;

    // Valida que el número de suscripciones activas sean mayores al número que tiene el usuario canceladas
    if(numCanceledSus>=numEnabledSus){
      return res.status(400).json({ message: "No se puede cancelar más de las suscripciones que el usuario tiene activas." });
    }


      // 2️ Registrar la transacción de cancelación
      const cancelTransaction = new Transaction({
        user: userId,
        fund: fundId,
        amount: existingTransaction.amount, // Devolver el mismo monto
        type: "cancelación"
      });
      await cancelTransaction.save();

      // 3️ Actualizar balance del usuario
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: existingTransaction.amount }
      });

      res.json({ message: "Cancelación exitosa", cancelTransaction });   
    } catch (error) {
        console.error("Error en leaveFund:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        
    }
}

module.exports = {
    leaveFund
}