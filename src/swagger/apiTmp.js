export const t_header = `/**
* @fileDescription: {{fileDescription}}
* @title: {{title}}
* @date: {{date}}
* @host: {{host}}
* @basePath: {{basePath}}
* @description: {{description}}
* @version: {{version}}
*/`;

export const t_content = `
{{each funs item index}}
/**
 * {{item.summary}}.
 * 调用函数 api_{{fileName}}_{{item.fuName}}{{each item.parameters v i}}
 * @param {{'{'+(v.type || 'object')+'}'}} {{v.description}}{{v.required?' - *必填':''}}.{{/each}}
*/
export function {{item.fuName}}(data, prop = {}) {
  return useRequest({
    data,
    ...prop,
    method: '{{item.type}}',{{if item.domain}}
    domain: '{{item.domain}}',{{/if}}
    url: '{{item.url}}',
    })
}
{{/each}}
`;
