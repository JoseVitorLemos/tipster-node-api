import { Knex } from 'knex'

export async function up(knex: Knex) {
	return knex.schema.createTable('members', table => {
		table.increments('id').primary().unique()
		table.string('email').notNullable().unique()
		table.string('user_name').notNullable().unique()
		table.string('telegram').notNullable()
		table.string('whatsapp').notNullable()
		table.string('first_name').notNullable()
		table.string('last_name').notNullable()
		table.string('password').notNullable()
		table.date('birth_date').notNullable()
		table.dateTime('created_at').notNullable()
		table.dateTime('updated_at').nullable()

	  table.integer('tipster_id')
			.notNullable()
			.references('id')
			.inTable('tipsters')
	})
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('members')
}
