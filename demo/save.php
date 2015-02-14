<pre>
<?php 
	sleep(3);
	$data = json_decode(file_get_contents('php://input'));
	print_r($data);
?>
</pre>