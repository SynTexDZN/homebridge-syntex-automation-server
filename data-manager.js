const store = require('json-fs-store');

module.exports = class DataManager
{
    constructor(storagePath)
    {
        this.data = {};

        if(storagePath != null)
        {
            this.storage = store(storagePath);

            this.storage.load('data', (err, obj) => {

                if(!obj || err)
                {
                    logger.log('error', 'bridge', 'Bridge', 'Data.json %read_error%! ' + err);
                }
                else
                {
                    this.data = obj.data;
                }
            });
        }
    }

    readAccessoryService(id, letters)
    {
        if(this.data != null
            && this.data[id] != null)
        {
            return this.data[id][letters];
        }
        else
        {
            return null;
        }
    }

    updateValues(id, letters, values)
    {
        if(this.data[id] == null)
        {
            this.data[id] = {};
        }

        if(this.data[id][letters] == null)
        {
            this.data[id][letters] = {};
        }

        for(const value in Object.keys(values))
        {
            this.data[id][letters][value] = values[value];
        }

        this.saveValues();

        console.log('SAVED VALUES', values);
    }

    saveValues()
    {
        this.storage.add({ id : 'data', data : this.data }, (err) => {

            if(err)
            {
                logger.log('error', 'bridge', 'Bridge', 'Data.json %update_error%! ' + err);
            }
        });
    }
}