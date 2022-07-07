export default {
    /**
     * 判断是否存在localStorage
     */
    hasStore: (name) => {
        if (!name) return;
        return !!window.localStorage.getItem(name)
    },
    /**
     * 存储localStorage
     */
    setStore: (name, content,cb) => {
        if (!name) return;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        window.localStorage.setItem(name, content);
        const storeList = window.localStorage.storeList ? JSON.parse(window.localStorage.getItem('storeList')) : [];
        storeList.push(name);
        window.localStorage.setItem('storeList', JSON.stringify(Array.from(new Set(storeList))));
        cb && setTimeout(cb,0)
    },
    /**
     * 获取localStorage
     */
    getStore: name => {
        if (!name) return;
        let value;
        try {
            value = JSON.parse(window.localStorage.getItem(name));
        } catch (err) {
            value = window.localStorage.getItem(name);
        }
        return value;
    },
    /**
     * 删除localStorage
     */
    removeStore: name => {
        if (!name) return;
        window.localStorage.removeItem(name);
    }
}
