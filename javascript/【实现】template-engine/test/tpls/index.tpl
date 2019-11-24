<html>
    <body>
        <div>
            <ul>
                <% for(let idx=0; idx < list.length; ++idx) { %>
                    <li>
                        <%= list[idx].key %>
                        <div>
                            <%= list[idx].val %>
                        </div>
                    </li>
                <% } %>
            </ul>
            <div>
                <%= str %>
            </div>
            <div>
                <%- obj.txt %>
            </div>
        </div>
    </body>
</html>
