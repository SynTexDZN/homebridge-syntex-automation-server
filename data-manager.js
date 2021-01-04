module.exports = class DataManager
{
    constructor()
    {
        this.data = {};
    }

    readValues(id, letters)
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

        console.log('SAVED VALUES', values);
    }
}