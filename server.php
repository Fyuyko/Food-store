<?php
//для JSON, тк обычно его с vue.js используют
$_POST = json_decode(file_get_contents("php://input"), true);
//а это общее
echo var_dump($_POST);