<?php

namespace WebBash\Models;

interface Model {
	public function load();

	public function save();

	public function merge( Model $other );
}