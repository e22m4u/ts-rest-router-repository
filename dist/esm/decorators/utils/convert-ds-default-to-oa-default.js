/**
 * Подменяет опцию "default" на "oaDefault" в схеме данных.
 *
 * @param dataSchema
 */
export function convertDsDefaultToOaDefault(dataSchema) {
    const res = { ...dataSchema };
    if (res.default) {
        res.oaDefault = res.default;
        delete res.default;
    }
    if (res.items) {
        res.items = convertDsDefaultToOaDefault(res.items);
    }
    if (res.properties) {
        for (const propName in res.properties) {
            const propValue = res.properties[propName];
            if (propValue) {
                res.properties[propName] = convertDsDefaultToOaDefault(propValue);
            }
        }
    }
    return res;
}
