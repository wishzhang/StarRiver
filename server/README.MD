#### 路由设计
1. session  
<table>
<tr>
    <th>方式</th>
    <th>路径</th>
 	<th>参数</th>
	<th>响应</th>
 	<th>备注</th>
</tr>
<tr>
    <th>GET</th>
    <th>/register</th>
	<th>username,password</th>
	<th>{code:0,data:{}}</th>
	<th>用户注册请求</th>
</tr>
<tr>
    <th>GET</th>
    <th>/login</th>
	<th>username,password</th>
	<th>{code:0,data:{}}code:0 成功
                        code:1 为请求失败
                        code:2 账号未注册

                        code:3 密码错误</th>
	<th>用户登录请求</th>
</tr>
</table>