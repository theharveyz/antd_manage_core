# antd_manage_core

# ChangeLog

### v1.1.8
*  在 table column 有`sorter`时，通过`sorterType`来设置排序参数的格式，支持`underline`,`camel` 


### v1.1.10
*  navigation 更新

### v1.1.11

*  navigation 收缩展示功能
*  table 组件支持 `qsFormatSearchQuery` 属性，布尔值，默认false，简化外部调用
*  fieldConfigs 每个配置 新增一个 `subConfig` 属性
    * `subConfig` 支持 `typeFor$IN` 和 `typeFor$NOT_IN` 赋值为 `textarea`， 之前对于 `in`、`not_in` 只支持 select
    * 对 type='date' 的情况，将之前的 `showTime` 挪至 `subConfig` 下
    * 对 type='date' 的情况，支持 `returnUtcSeconds` ，布尔值， 默认关闭。返回选择的时间的 UTC 秒数，避免小贷后台外部调用时，每次都需要计算。
    
### v1.1.12
*  支持 http patch 方法
*  支持配置文件设置全局的超时时间,调用如下
```
    ...
    core: {
        httpRequst: {
          timeout: 10000
        }
        ...
    }
```       

### v1.1.13
*  手贱发了个空版本

### v1.1.14
* 表格组件支持传入 `expandedRowRender`, 修复两个表格嵌套时，父表格数据没有加载成功时，代码崩溃的错误
 