const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'DeviceLog',
    tableName: 'device_logs',
    columns: {
        id: {
            type: 'varchar',
            primary: true,
            length: 255
        },
        date: {
            type: 'varchar',
            nullable: false
        },
        user_name: {
            type: 'varchar',
            nullable: false,
            length: 255
        },
        pc: {
            type: 'varchar',
            nullable: false,
            length: 255
        },
        activity: {
            type: 'varchar',
            nullable: false,
            length: 255
        },
        anomaly_score: {
            type: 'real',
            default: 0
        },
        is_anomaly: {
            type: 'integer',
            default: 0
        }
    },
    indices: [
        {
            name: 'idx_user_name',
            columns: ['user_name']
        },
        {
            name: 'idx_is_anomaly',
            columns: ['is_anomaly']
        },
        {
            name: 'idx_date',
            columns: ['date']
        }
    ]
});
