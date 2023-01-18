namespace cadastro_livro
{
    partial class Form2
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.ColumnHeader column_Quant_Estoque;
            this.btnRegistraVenda = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.quantProdVenda = new System.Windows.Forms.NumericUpDown();
            this.textPrecoProdutos = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.btnLimparVenda = new System.Windows.Forms.Button();
            this.btnBuscaClienteVenda = new System.Windows.Forms.Button();
            this.textNomeCliente = new System.Windows.Forms.TextBox();
            this.listViewCliVenda = new System.Windows.Forms.ListView();
            this.id = new System.Windows.Forms.ColumnHeader();
            this.col_name = new System.Windows.Forms.ColumnHeader();
            this.col_apelido = new System.Windows.Forms.ColumnHeader();
            this.col_divida = new System.Windows.Forms.ColumnHeader();
            this.btnAddProdVenda = new System.Windows.Forms.Button();
            this.listViewProdVenda = new System.Windows.Forms.ListView();
            this.column_Id = new System.Windows.Forms.ColumnHeader();
            this.column_Nome = new System.Windows.Forms.ColumnHeader();
            this.column_Categoria = new System.Windows.Forms.ColumnHeader();
            this.column_Tam = new System.Windows.Forms.ColumnHeader();
            this.column_Preco = new System.Windows.Forms.ColumnHeader();
            this.listViewProdAddVenda = new System.Windows.Forms.ListView();
            this.columnId = new System.Windows.Forms.ColumnHeader();
            this.columnNome = new System.Windows.Forms.ColumnHeader();
            this.columnCategoria = new System.Windows.Forms.ColumnHeader();
            this.columnTamanho = new System.Windows.Forms.ColumnHeader();
            this.columnQtd = new System.Windows.Forms.ColumnHeader();
            this.columnValor = new System.Windows.Forms.ColumnHeader();
            this.label3 = new System.Windows.Forms.Label();
            this.btnRemovProdVenda = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.comboTipoVenda = new System.Windows.Forms.ComboBox();
            this.label5 = new System.Windows.Forms.Label();
            this.textCliente = new System.Windows.Forms.TextBox();
            this.cliente_anonimo = new System.Windows.Forms.CheckBox();
            this.label6 = new System.Windows.Forms.Label();
            this.comboDesconto = new System.Windows.Forms.ComboBox();
            this.textPrecoVenda = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.textBuscaProd = new System.Windows.Forms.TextBox();
            this.buttonBucaProd = new System.Windows.Forms.Button();
            column_Quant_Estoque = new System.Windows.Forms.ColumnHeader();
            ((System.ComponentModel.ISupportInitialize)(this.quantProdVenda)).BeginInit();
            this.SuspendLayout();
            // 
            // column_Quant_Estoque
            // 
            column_Quant_Estoque.Text = "Estoque";
            column_Quant_Estoque.Width = 35;
            // 
            // btnRegistraVenda
            // 
            this.btnRegistraVenda.Location = new System.Drawing.Point(341, 348);
            this.btnRegistraVenda.Name = "btnRegistraVenda";
            this.btnRegistraVenda.Size = new System.Drawing.Size(255, 23);
            this.btnRegistraVenda.TabIndex = 0;
            this.btnRegistraVenda.Text = "Registrar Venda";
            this.btnRegistraVenda.UseVisualStyleBackColor = true;
            this.btnRegistraVenda.Click += new System.EventHandler(this.btnRegistraVenda_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 11);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(55, 15);
            this.label1.TabIndex = 2;
            this.label1.Text = "Produtos";
            // 
            // quantProdVenda
            // 
            this.quantProdVenda.Enabled = false;
            this.quantProdVenda.Location = new System.Drawing.Point(12, 176);
            this.quantProdVenda.Name = "quantProdVenda";
            this.quantProdVenda.Size = new System.Drawing.Size(47, 23);
            this.quantProdVenda.TabIndex = 8;
            this.quantProdVenda.ValueChanged += new System.EventHandler(this.quantProdVenda_ValueChanged);
            // 
            // textPrecoProdutos
            // 
            this.textPrecoProdutos.Enabled = false;
            this.textPrecoProdutos.Location = new System.Drawing.Point(341, 266);
            this.textPrecoProdutos.Name = "textPrecoProdutos";
            this.textPrecoProdutos.PlaceholderText = "R$ 0,00";
            this.textPrecoProdutos.Size = new System.Drawing.Size(126, 23);
            this.textPrecoProdutos.TabIndex = 14;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(335, 248);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(106, 15);
            this.label2.TabIndex = 15;
            this.label2.Text = "Valor dos Produtos";
            this.label2.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // btnLimparVenda
            // 
            this.btnLimparVenda.Location = new System.Drawing.Point(341, 373);
            this.btnLimparVenda.Name = "btnLimparVenda";
            this.btnLimparVenda.Size = new System.Drawing.Size(255, 23);
            this.btnLimparVenda.TabIndex = 17;
            this.btnLimparVenda.Text = "Limpar";
            this.btnLimparVenda.UseVisualStyleBackColor = true;
            this.btnLimparVenda.Click += new System.EventHandler(this.btnLimparVenda_Click);
            // 
            // btnBuscaClienteVenda
            // 
            this.btnBuscaClienteVenda.Location = new System.Drawing.Point(209, 219);
            this.btnBuscaClienteVenda.Name = "btnBuscaClienteVenda";
            this.btnBuscaClienteVenda.Size = new System.Drawing.Size(88, 23);
            this.btnBuscaClienteVenda.TabIndex = 18;
            this.btnBuscaClienteVenda.Text = "Buscar Cliente";
            this.btnBuscaClienteVenda.UseVisualStyleBackColor = true;
            // 
            // textNomeCliente
            // 
            this.textNomeCliente.Location = new System.Drawing.Point(12, 219);
            this.textNomeCliente.Name = "textNomeCliente";
            this.textNomeCliente.PlaceholderText = "Nome do Cliente";
            this.textNomeCliente.Size = new System.Drawing.Size(191, 23);
            this.textNomeCliente.TabIndex = 19;
            // 
            // listViewCliVenda
            // 
            this.listViewCliVenda.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.id,
            this.col_name,
            this.col_apelido,
            this.col_divida});
            this.listViewCliVenda.FullRowSelect = true;
            this.listViewCliVenda.Location = new System.Drawing.Point(12, 247);
            this.listViewCliVenda.Name = "listViewCliVenda";
            this.listViewCliVenda.Size = new System.Drawing.Size(285, 103);
            this.listViewCliVenda.TabIndex = 20;
            this.listViewCliVenda.UseCompatibleStateImageBehavior = false;
            this.listViewCliVenda.View = System.Windows.Forms.View.Details;
            this.listViewCliVenda.SelectedIndexChanged += new System.EventHandler(this.listViewCliVenda_Click);
            // 
            // id
            // 
            this.id.Text = "id";
            this.id.Width = 30;
            // 
            // col_name
            // 
            this.col_name.Text = "Nome";
            this.col_name.Width = 100;
            // 
            // col_apelido
            // 
            this.col_apelido.Text = "Apelido";
            this.col_apelido.Width = 90;
            // 
            // col_divida
            // 
            this.col_divida.Text = "Divida";
            // 
            // btnAddProdVenda
            // 
            this.btnAddProdVenda.Enabled = false;
            this.btnAddProdVenda.Location = new System.Drawing.Point(65, 176);
            this.btnAddProdVenda.Name = "btnAddProdVenda";
            this.btnAddProdVenda.Size = new System.Drawing.Size(232, 23);
            this.btnAddProdVenda.TabIndex = 21;
            this.btnAddProdVenda.Text = "Add";
            this.btnAddProdVenda.UseVisualStyleBackColor = true;
            this.btnAddProdVenda.Click += new System.EventHandler(this.btnAddProdVenda_Click);
            // 
            // listViewProdVenda
            // 
            this.listViewProdVenda.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.column_Id,
            this.column_Nome,
            this.column_Categoria,
            this.column_Tam,
            this.column_Preco,
            column_Quant_Estoque});
            this.listViewProdVenda.FullRowSelect = true;
            this.listViewProdVenda.Location = new System.Drawing.Point(12, 42);
            this.listViewProdVenda.Name = "listViewProdVenda";
            this.listViewProdVenda.Size = new System.Drawing.Size(285, 126);
            this.listViewProdVenda.TabIndex = 23;
            this.listViewProdVenda.UseCompatibleStateImageBehavior = false;
            this.listViewProdVenda.View = System.Windows.Forms.View.Details;
            this.listViewProdVenda.SelectedIndexChanged += new System.EventHandler(this.listViewProdVenda_Click);
            // 
            // column_Id
            // 
            this.column_Id.Text = "id";
            this.column_Id.Width = 0;
            // 
            // column_Nome
            // 
            this.column_Nome.Text = "Nome";
            this.column_Nome.Width = 75;
            // 
            // column_Categoria
            // 
            this.column_Categoria.Text = "Categoria";
            // 
            // column_Tam
            // 
            this.column_Tam.Text = "Tamanho";
            // 
            // column_Preco
            // 
            this.column_Preco.Text = "Preço Venda";
            this.column_Preco.Width = 45;
            // 
            // listViewProdAddVenda
            // 
            this.listViewProdAddVenda.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnId,
            this.columnNome,
            this.columnCategoria,
            this.columnTamanho,
            this.columnQtd,
            this.columnValor});
            this.listViewProdAddVenda.FullRowSelect = true;
            this.listViewProdAddVenda.Location = new System.Drawing.Point(311, 25);
            this.listViewProdAddVenda.Name = "listViewProdAddVenda";
            this.listViewProdAddVenda.Size = new System.Drawing.Size(285, 143);
            this.listViewProdAddVenda.TabIndex = 24;
            this.listViewProdAddVenda.UseCompatibleStateImageBehavior = false;
            this.listViewProdAddVenda.View = System.Windows.Forms.View.Details;
            this.listViewProdAddVenda.SelectedIndexChanged += new System.EventHandler(this.listViewProdAddVenda_Click);
            // 
            // columnId
            // 
            this.columnId.Text = "id";
            this.columnId.Width = 0;
            // 
            // columnNome
            // 
            this.columnNome.Text = "Produto";
            // 
            // columnCategoria
            // 
            this.columnCategoria.Text = "Categoria";
            // 
            // columnTamanho
            // 
            this.columnTamanho.Text = "tamanho";
            // 
            // columnQtd
            // 
            this.columnQtd.Text = "Quantidade";
            // 
            // columnValor
            // 
            this.columnValor.Text = "Valor";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(311, 7);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(124, 15);
            this.label3.TabIndex = 25;
            this.label3.Text = "Produtos Adicionados";
            this.label3.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // btnRemovProdVenda
            // 
            this.btnRemovProdVenda.Enabled = false;
            this.btnRemovProdVenda.Location = new System.Drawing.Point(311, 174);
            this.btnRemovProdVenda.Name = "btnRemovProdVenda";
            this.btnRemovProdVenda.Size = new System.Drawing.Size(285, 23);
            this.btnRemovProdVenda.TabIndex = 26;
            this.btnRemovProdVenda.Text = "Remover";
            this.btnRemovProdVenda.UseVisualStyleBackColor = true;
            this.btnRemovProdVenda.Click += new System.EventHandler(this.btnRemovProdVenda_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(335, 202);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(81, 15);
            this.label4.TabIndex = 27;
            this.label4.Text = "Tipo da venda";
            this.label4.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // comboTipoVenda
            // 
            this.comboTipoVenda.Enabled = false;
            this.comboTipoVenda.FormattingEnabled = true;
            this.comboTipoVenda.Items.AddRange(new object[] {
            "A prazo",
            "Pix",
            "Cartão Débito",
            "Cartão Crédito"});
            this.comboTipoVenda.Location = new System.Drawing.Point(341, 220);
            this.comboTipoVenda.Name = "comboTipoVenda";
            this.comboTipoVenda.Size = new System.Drawing.Size(126, 23);
            this.comboTipoVenda.TabIndex = 28;
            this.comboTipoVenda.Text = "Select";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(473, 202);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(44, 15);
            this.label5.TabIndex = 29;
            this.label5.Text = "Cliente";
            this.label5.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // textCliente
            // 
            this.textCliente.Enabled = false;
            this.textCliente.Location = new System.Drawing.Point(473, 220);
            this.textCliente.Name = "textCliente";
            this.textCliente.Size = new System.Drawing.Size(123, 23);
            this.textCliente.TabIndex = 30;
            // 
            // cliente_anonimo
            // 
            this.cliente_anonimo.AutoSize = true;
            this.cliente_anonimo.Location = new System.Drawing.Point(12, 365);
            this.cliente_anonimo.Name = "cliente_anonimo";
            this.cliente_anonimo.Size = new System.Drawing.Size(99, 19);
            this.cliente_anonimo.TabIndex = 31;
            this.cliente_anonimo.Text = "Sem Cadastro";
            this.cliente_anonimo.UseVisualStyleBackColor = true;
            this.cliente_anonimo.CheckedChanged += new System.EventHandler(this.cliente_anonimo_CheckedChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(471, 248);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(90, 15);
            this.label6.TabIndex = 33;
            this.label6.Text = "Desconto em %";
            this.label6.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // comboDesconto
            // 
            this.comboDesconto.Enabled = false;
            this.comboDesconto.FormattingEnabled = true;
            this.comboDesconto.Items.AddRange(new object[] {
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10"});
            this.comboDesconto.Location = new System.Drawing.Point(473, 266);
            this.comboDesconto.Name = "comboDesconto";
            this.comboDesconto.Size = new System.Drawing.Size(126, 23);
            this.comboDesconto.TabIndex = 34;
            this.comboDesconto.Text = "Select";
            this.comboDesconto.SelectedIndexChanged += new System.EventHandler(this.comboDesconto_SelectedIndexChanged);
            // 
            // textPrecoVenda
            // 
            this.textPrecoVenda.Enabled = false;
            this.textPrecoVenda.Location = new System.Drawing.Point(341, 311);
            this.textPrecoVenda.Name = "textPrecoVenda";
            this.textPrecoVenda.PlaceholderText = "R$ 0,00";
            this.textPrecoVenda.Size = new System.Drawing.Size(126, 23);
            this.textPrecoVenda.TabIndex = 35;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(341, 292);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(84, 15);
            this.label7.TabIndex = 36;
            this.label7.Text = "Valor da Venda";
            this.label7.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // textBuscaProd
            // 
            this.textBuscaProd.Location = new System.Drawing.Point(73, 7);
            this.textBuscaProd.Name = "textBuscaProd";
            this.textBuscaProd.PlaceholderText = "Nome do Produto";
            this.textBuscaProd.Size = new System.Drawing.Size(158, 23);
            this.textBuscaProd.TabIndex = 37;
            // 
            // buttonBucaProd
            // 
            this.buttonBucaProd.Location = new System.Drawing.Point(237, 7);
            this.buttonBucaProd.Name = "buttonBucaProd";
            this.buttonBucaProd.Size = new System.Drawing.Size(60, 23);
            this.buttonBucaProd.TabIndex = 38;
            this.buttonBucaProd.Text = "Buscar Produto";
            this.buttonBucaProd.UseVisualStyleBackColor = true;
            this.buttonBucaProd.Click += new System.EventHandler(this.buttonBucaProd_Click);
            // 
            // Form2
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(608, 408);
            this.Controls.Add(this.buttonBucaProd);
            this.Controls.Add(this.textBuscaProd);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.textPrecoVenda);
            this.Controls.Add(this.comboDesconto);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.cliente_anonimo);
            this.Controls.Add(this.textCliente);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.comboTipoVenda);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.btnRemovProdVenda);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.listViewProdAddVenda);
            this.Controls.Add(this.listViewProdVenda);
            this.Controls.Add(this.btnAddProdVenda);
            this.Controls.Add(this.listViewCliVenda);
            this.Controls.Add(this.textNomeCliente);
            this.Controls.Add(this.btnBuscaClienteVenda);
            this.Controls.Add(this.btnLimparVenda);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textPrecoProdutos);
            this.Controls.Add(this.quantProdVenda);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnRegistraVenda);
            this.Name = "Form2";
            this.Text = "Form2";
            ((System.ComponentModel.ISupportInitialize)(this.quantProdVenda)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Button btnRegistraVenda;
        private Label label1;
        private NumericUpDown quantProdVenda;
        private TextBox textPrecoProdutos;
        private Label label2;
        private Button btnLimparVenda;
        private Button btnBuscaClienteVenda;
        private TextBox textNomeCliente;
        private ListView listViewCliVenda;
        private ColumnHeader id;
        private ColumnHeader col_name;
        private ColumnHeader col_apelido;
        private ColumnHeader col_divida;
        private Button btnAddProdVenda;
        private ListView listViewProdVenda;
        private ColumnHeader column_Id;
        private ColumnHeader column_Nome;
        private ColumnHeader column_Categoria;
        private ColumnHeader column_Tam;
        private ColumnHeader column_Preco;
        private ListView listViewProdAddVenda;
        private ColumnHeader columnId;
        private ColumnHeader columnNome;
        private ColumnHeader columnCategoria;
        private ColumnHeader columnTamanho;
        private ColumnHeader columnQtd;
        private ColumnHeader columnValor;
        private Label label3;
        private Button btnRemovProdVenda;
        private Label label4;
        private ComboBox comboTipoVenda;
        private Label label5;
        private TextBox textCliente;
        private CheckBox cliente_anonimo;
        private Label label6;
        private ComboBox comboDesconto;
        private TextBox textPrecoVenda;
        private Label label7;
        private TextBox textBuscaProd;
        private Button buttonBucaProd;
    }
}