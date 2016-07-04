<?php
function get($type, $data){
  if(!empty($_GET[$type]) && function_exists("get_$type")){
    call_user_func("get_$type", $data);
  }
}

function get_cpu($data = false){
  if($data){unset($data);} // No need for input here

  $load = sys_getloadavg();

  output_json(array(
    "total" => 100,
    "used" => round(($load[0]*10)),
    "free" => round(100-($load[0]*10)),
  ));
}

function get_mem($data = false){
  if($data){unset($data);} // No need for input here

  $lines = (string)trim(shell_exec("egrep 'MemTotal|MemFree|Buffers|Cached' /proc/meminfo"));
  $lines = str_replace(array(' ', 'kB'), '', $lines);
  $lines = explode("\n", $lines);

  array_pop($lines);

  $mem = array();

  foreach($lines as $key => $line){
    $data = explode(':', $line);

    $mem[$data[0]] = round((int)$data[1]/1048576);
  }

  output_json(array(
    'total' => $mem['MemTotal'],
    'free' => $mem['MemFree'] + $mem['Buffers'] + $mem['Cached'],
    'used' => $mem['MemTotal'] - ($mem['MemFree'] + $mem['Buffers'] + $mem['Cached']),
  ));
}

function get_disk($data = false){
  if($data){unset($data);} // No need for input here

  output_json(array(
    "total" => round(disk_total_space("/")/1000/1000/1000, 2),
    "free" => round(disk_free_space("/")/1000/1000/1000, 2),
    "used" => round((disk_total_space("/")/1000/1000/1000) - (disk_free_space("/")/1000/1000/1000), 2),
  ));
}

function output_json($arr){
  output_headers();

  print json_encode($arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
}

function output_headers(){
  header("Access-Control-Allow-Origin:*"); // Accept requests from any origin
  header("Content-type:application/json"); // All requests return json objects
}
