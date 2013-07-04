<?php

/**
 * Copyright (C) 2013 Tyler Romeo, Krzysztof Jordan, Nicholas Bevaqua
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @file
 */

namespace WebBash\Models;

/**
 * Represents a database model that can be used with the ProcessCache
 *
 * @see \WebBash\ProcessCache\ProcessCache
 */
interface Model {
	/**
	 * Loads the information from the database
	 *
	 * Models are allowed to load data lazily in order to prevent unnecessary
	 * work. If this function is called, the model MUST load the data so that
	 * callers can access it.
	 */
	public function load();

	/**
	 * Save the information to the database
	 */
	public function save();

	/**
	 * Merge information from another model into this model
	 *
	 * When the process cache is updated, which occurs whenever one model gets
	 * their Model::load() function called, all the objects that are semantically
	 * equivalent are combined. This function will be called on all objects
	 * that are the same.
	 *
	 * @param \WebBash\Models\Model $other The model that was loaded
	 */
	public function merge( Model $other );
}
