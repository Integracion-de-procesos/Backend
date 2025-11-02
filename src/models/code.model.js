const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../db");

class CodigoVerificacion extends Model { }

CodigoVerificacion.init(
    {
        idCodigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        correoElectronico: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expira: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        verificado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "CodigoVerificacion",
        tableName: "codigoVerificacion"
    }
)
module.exports = CodigoVerificacion;
